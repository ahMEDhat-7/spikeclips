import { Logger } from "@nestjs/common";
import { Job as BullMQJob, Worker } from "bullmq";
import { extractTopScenes } from "@spikeclip/shared";
import { PrismaService } from "../database/prisma.service";
import { Prisma } from "@prisma/client";

interface HeatmapJobData {
  jobId: string;
  url: string;
  userId: string;
}

const connectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
};

export function createHeatmapWorker(prisma: PrismaService): Worker {
  const logger = new Logger("HeatmapWorker");

  const worker = new Worker(
    "analysis",
    async (bullJob: BullMQJob<HeatmapJobData>) => {
      const { jobId, url } = bullJob.data;
      logger.log(`Processing heatmap for job ${jobId}`);

      try {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "processing" },
        });

        const { exec } = await import("child_process");
        const { promisify } = await import("util");
        const execAsync = promisify(exec);

        const { stdout } = await execAsync(
          `yt-dlp -j --no-download "${url}"`
        );
        const metadata = JSON.parse(stdout);
        const heatmap = (metadata.heatmap ?? []) as Array<{
          start_time: number;
          end_time: number;
          value: number;
        }>;

        if (!heatmap.length) {
          await prisma.job.update({
            where: { id: jobId },
            data: { status: "failed", errorMessage: "No heatmap data found for this video" },
          });
          return;
        }

        const scenes = extractTopScenes(heatmap);

        await prisma.job.update({
          where: { id: jobId },
          data: {
            status: "completed",
            heatmapData: heatmap as unknown as Prisma.InputJsonValue,
            scenes: scenes as unknown as Prisma.InputJsonValue,
            completedAt: new Date(),
          },
        });

        logger.log(`Completed heatmap for job ${jobId}: ${scenes.length} scenes`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.error(`Heatmap job ${jobId} failed: ${message}`);

        await prisma.job.update({
          where: { id: jobId },
          data: { status: "failed", errorMessage: message },
        });
      }
    },
    { connection: connectionOptions, concurrency: 5 }
  );

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  worker.on("ready", () => {
    logger.log("Heatmap worker ready");
  });

  return worker;
}
