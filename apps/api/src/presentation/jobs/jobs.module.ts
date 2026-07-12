import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { CreateJobUseCase } from "../../application/use-cases/create-job.use-case";
import { ProcessHeatmapUseCase } from "../../application/use-cases/process-heatmap.use-case";
import { ExportClipsUseCase } from "../../application/use-cases/export-clips.use-case";
import { JOB_REPOSITORY } from "../../domain/repositories/job.repository";
import { PrismaJobRepository } from "../../infrastructure/database/repositories/prisma-job.repository";
import { VIDEO_EXTRACTOR } from "../../domain/services/video-extractor";
import { YtdlpService } from "../../infrastructure/external/ytdlp.service";
import { QUEUE_SERVICE } from "../../domain/services/queue";
import { BullMQQueueService } from "../../infrastructure/external/queue.service";
import { StorageModule } from "../../infrastructure/storage/storage.module";
import { PrismaModule } from "../../infrastructure/database/prisma.module";

@Module({
  imports: [StorageModule, PrismaModule],
  controllers: [JobsController],
  providers: [
    CreateJobUseCase,
    ProcessHeatmapUseCase,
    ExportClipsUseCase,
    {
      provide: JOB_REPOSITORY,
      useClass: PrismaJobRepository,
    },
    {
      provide: VIDEO_EXTRACTOR,
      useClass: YtdlpService,
    },
    {
      provide: QUEUE_SERVICE,
      useClass: BullMQQueueService,
    },
  ],
  exports: [CreateJobUseCase, ProcessHeatmapUseCase, ExportClipsUseCase],
})
export class JobsModule {}
