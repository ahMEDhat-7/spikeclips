import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { CreateJobUseCase } from "../../application/use-cases/create-job.use-case";
import { ProcessHeatmapUseCase } from "../../application/use-cases/process-heatmap.use-case";
import { ExportClipsUseCase } from "../../application/use-cases/export-clips.use-case";
import { JobRepository } from "../../domain/repositories/job.repository";
import { PrismaJobRepository } from "../../infrastructure/database/repositories/prisma-job.repository";
import { VideoExtractor } from "../../domain/services/video-extractor";
import { YtdlpService } from "../../infrastructure/external/ytdlp.service";
import { QueueService } from "../../domain/services/queue";
import { BullMQQueueService } from "../../infrastructure/external/queue.service";

@Module({
  controllers: [JobsController],
  providers: [
    CreateJobUseCase,
    ProcessHeatmapUseCase,
    ExportClipsUseCase,
    {
      provide: JobRepository,
      useClass: PrismaJobRepository,
    },
    {
      provide: VideoExtractor,
      useClass: YtdlpService,
    },
    {
      provide: QueueService,
      useClass: BullMQQueueService,
    },
  ],
  exports: [CreateJobUseCase, ProcessHeatmapUseCase, ExportClipsUseCase],
})
export class JobsModule {}
