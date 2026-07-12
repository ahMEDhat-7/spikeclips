import { Logger } from "@nestjs/common";
import { Job as BullMQJob, Worker } from "bullmq";
import { PrismaService } from "../database/prisma.service";
import { StorageService } from "../storage/storage.interface";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import { unlink, mkdir, stat } from "fs/promises";
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
}

const connectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

export function createClipWorker(
  prisma: PrismaService,
  storage: StorageService
): Worker {
  const logger = new Logger("ClipWorker");

  const worker = new Worker(
    "export",
    async (bullJob: BullMQJob<ClipExportJobData>) => {
      const { jobId, clipId, sceneIndex, videoUrl, startTime, endTime, vertical } =
        bullJob.data;
      logger.log(`Processing clip ${clipId} (scene ${sceneIndex}) for job ${jobId}`);

      await mkdir(TMP_DIR, { recursive: true });

      try {
        await prisma.clip.update({
          where: { id: clipId },
          data: { status: "processing" },
        });

        const tmpInput = join(TMP_DIR, `${clipId}-source.mp4`);
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
            "--force-keyframes-at-cuts",
            tmpOutput,
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
            "--force-keyframes-at-cuts",
            tmpOutput,
          ]);
        }

        const storageKey = `clips/${jobId}/${sceneIndex}-${randomUUID().slice(0, 8)}.mp4`;
        await storage.uploadFromFile(tmpOutput, storageKey, "video/mp4");
        const fileUrl = await storage.getSignedUrl(storageKey);
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
