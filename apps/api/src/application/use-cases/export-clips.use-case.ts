import { Injectable, Logger } from "@nestjs/common";
import { JobRepository } from "../../domain/repositories/job.repository";
import { QueueService } from "../../domain/services/queue";
import { JobNotFoundException } from "../../domain/exceptions/job-not-found.exception";

@Injectable()
export class ExportClipsUseCase {
  private readonly logger = new Logger(ExportClipsUseCase.name);

  constructor(
    private readonly jobRepository: JobRepository,
    private readonly queueService: QueueService
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
      if (scenes[idx]) {
        const clipId = `${jobId}-${idx}`;
        await this.queueService.addExportJob(jobId, {
          clipId,
          sceneIndex: idx,
        });
        clipJobIds.push(clipId);
      }
    }

    return { jobId, clipJobIds };
  }
}
