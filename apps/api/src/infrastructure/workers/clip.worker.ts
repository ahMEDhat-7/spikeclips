import { Logger } from "@nestjs/common";
import { Job as BullMQJob, Worker } from "bullmq";
import { PrismaService } from "../database/prisma.service";
import { StorageService } from "../storage/storage.interface";
import { FfmpegService } from "../external/ffmpeg.service";
import { CaptionOverlay, MusicMixConfig } from "../../domain/services/video-processor";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import { unlink, mkdir, stat, access } from "fs/promises";
import { join } from "path";

const execFileAsync = promisify(execFile);
const TMP_DIR = "/tmp/spikeclips-export";

interface ClipExportJobData {
  jobId: string;
  clipId: string;
  sceneIndex: number;
  videoUrl: string;
  startTime: number;
  endTime: number;
  vertical?: boolean;
  platform?: string;
  format?: string;
  quality?: string;
  captions?: CaptionOverlay[];
  music?: MusicMixConfig;
  templateId?: string;
  templateConfig?: Record<string, unknown>;
}

const connectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function createClipWorker(
  prisma: PrismaService,
  storage: StorageService,
  ffmpeg?: FfmpegService
): Worker {
  const logger = new Logger("ClipWorker");

  const worker = new Worker(
    "export",
    async (bullJob: BullMQJob<ClipExportJobData>) => {
      const {
        jobId, clipId, sceneIndex, videoUrl, startTime, endTime,
        vertical, captions, music,
      } = bullJob.data;
      logger.log(`Processing clip ${clipId} (scene ${sceneIndex}) for job ${jobId}`);

      await mkdir(TMP_DIR, { recursive: true });

      try {
        await prisma.clip.update({
          where: { id: clipId },
          data: { status: "processing" },
        });

        const tmpInput = join(TMP_DIR, `${clipId}-source.mp4`);
        const tmpCropped = join(TMP_DIR, `${clipId}-cropped.mp4`);
        const tmpCaptions = join(TMP_DIR, `${clipId}-captions.mp4`);
        const tmpOutput = join(TMP_DIR, `${clipId}-output.mp4`);

        const duration = endTime - startTime;

        await execFileAsync("yt-dlp", [
          "-f",
          "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]",
          "--download-sections",
          `*${startTime}-${endTime}`,
          "--force-keyframes-at-cuts",
          "-o",
          tmpInput,
          videoUrl,
        ]);

        if (vertical) {
          await execFileAsync("ffmpeg", [
            "-y",
            "-i",
            tmpInput,
            "-vf",
            "crop=ih*9/16:ih,scale=1080:1920",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            tmpCropped,
          ]);
        } else {
          await execFileAsync("ffmpeg", [
            "-y",
            "-i",
            tmpInput,
            "-t",
            String(duration),
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            tmpCropped,
          ]);
        }

        let currentFile = tmpCropped;

        if (captions && captions.length > 0 && ffmpeg) {
          try {
            await ffmpeg.overlayCaptions(currentFile, tmpCaptions, captions, duration);
            currentFile = tmpCaptions;
            logger.log(`Applied ${captions.length} caption(s) to clip ${clipId}`);
          } catch (capErr) {
            logger.warn(`Caption overlay failed for ${clipId}: ${capErr instanceof Error ? capErr.message : capErr}`);
          }
        }

        if (music) {
          try {
            const musicPath = join(TMP_DIR, `${clipId}-music-${music.fileKey}`);

            if (await fileExists(musicPath)) {
              await ffmpeg?.mixAudio(currentFile, musicPath, tmpOutput, music);
              currentFile = tmpOutput;
              logger.log(`Mixed music into clip ${clipId}`);
            } else {
              logger.warn(`Music file not found for clip ${clipId}, skipping mix`);
            }
          } catch (musErr) {
            logger.warn(`Music mix failed for ${clipId}: ${musErr instanceof Error ? musErr.message : musErr}`);
          }
        }

        if (currentFile !== tmpOutput) {
          await execFileAsync("cp", [currentFile, tmpOutput]);
        }

        const storageKey = `clips/${jobId}/${sceneIndex}-${randomUUID().slice(0, 8)}.mp4`;
        await storage.uploadFromFile(tmpOutput, storageKey, "video/mp4");
        const fileUrl = storageKey;
        const fileSize = (await stat(tmpOutput)).size;

        await prisma.clip.update({
          where: { id: clipId },
          data: {
            status: "completed",
            fileUrl,
            fileSize,
            duration,
            completedAt: new Date(),
          },
        });

        await unlink(tmpInput).catch(() => {});
        await unlink(tmpCropped).catch(() => {});
        await unlink(tmpCaptions).catch(() => {});
        await unlink(tmpOutput).catch(() => {});

        logger.log(`Completed clip ${clipId}: ${fileUrl}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.error(`Clip ${clipId} failed: ${message}`);

        await prisma.clip.update({
          where: { id: clipId },
          data: { status: "failed", errorMessage: message },
        });
      }
    },
    {
      connection: connectionOptions,
      concurrency: parseInt(process.env.CLIP_WORKER_CONCURRENCY || "3"),
    }
  );

  worker.on("failed", (job, err) => {
    logger.error(`Clip job ${job?.id} failed: ${err.message}`);
  });

  worker.on("ready", () => {
    logger.log("Clip worker ready");
  });

  return worker;
}
