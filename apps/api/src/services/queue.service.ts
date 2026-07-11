import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly analysisQueue: Queue;
  private readonly exportQueue: Queue;

  constructor() {
    this.analysisQueue = new Queue("analysis", { connection });
    this.exportQueue = new Queue("export", { connection });
    this.logger.log("Queues initialized");
  }

  async addAnalysisJob(jobId: string, data: { url: string; userId: string }) {
    return this.analysisQueue.add("process", data, {
      jobId,
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  async addExportJob(jobId: string, data: { clipId: string; sceneIndex: number }) {
    return this.exportQueue.add("export-clip", data, {
      jobId: `export-${jobId}-${data.sceneIndex}`,
      attempts: 2,
      backoff: { type: "exponential", delay: 10000 },
    });
  }

  createWorker(
    queueName: string,
    processor: (jobData: any) => Promise<void>
  ): Worker {
    const worker = new Worker(
      queueName,
      async (job) => {
        this.logger.log(`Processing ${queueName} job ${job.id}`);
        await processor(job.data);
        this.logger.log(`Completed ${queueName} job ${job.id}`);
      },
      { connection }
    );

    worker.on("failed", (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err.message}`);
    });

    return worker;
  }

  async onModuleDestroy() {
    await connection.quit();
  }
}
