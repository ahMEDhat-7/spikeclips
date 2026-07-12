import { Injectable, Logger, Inject } from "@nestjs/common";
import { randomUUID } from "crypto";
import { JobRepository, JOB_REPOSITORY } from "../../domain/repositories/job.repository";
import { QueueService, QUEUE_SERVICE } from "../../domain/services/queue";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { JobNotFoundException } from "../../domain/exceptions/job-not-found.exception";

@Injectable()
export class ExportClipsUseCase {
  private readonly logger = new Logger(ExportClipsUseCase.name);

  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepository,
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
    private readonly prisma: PrismaService
  ) {}

  async execute(
    jobId: string,
    sceneIndices: number[]
  ): Promise<{ jobId: string; clipJobIds: string[] }> {
    this.logger.log(`Exporting clips for job ${jobId}: ${sceneIndices}`);

    const job = await this.jobRepository.findById(jobId);
    if (!job) throw new JobNotFoundException(jobId);

    const scenes = job.scenes ?? [];
    const clipJobIds: string[] = [];

    for (const idx of sceneIndices) {
      const scene = scenes[idx];
      if (!scene) continue;

      const clipId = randomUUID();

      await this.prisma.clip.create({
        data: {
          id: clipId,
          jobId,
          sceneIndex: idx,
          startTime: scene.start_time,
          endTime: scene.end_time,
          peakIntensity: scene.peak_intensity,
          status: "pending",
        },
      });

      await this.queueService.addExportJob(jobId, {
        clipId,
        sceneIndex: idx,
      });

      clipJobIds.push(clipId);
    }

    return { jobId, clipJobIds };
  }
}
