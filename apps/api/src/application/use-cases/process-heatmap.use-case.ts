import { Injectable, Logger } from "@nestjs/common";
import {
  mergeHeatmapSpikes,
  capAndScoreBlocks,
  selectTopScenes,
  DEFAULT_ALGORITHM_CONFIG,
} from "@spikeclip/shared";
import { JobRepository } from "../../domain/repositories/job.repository";
import { JobNotFoundException } from "../../domain/exceptions/job-not-found.exception";
import { JobResponseDto } from "../dto/job-response.dto";

@Injectable()
export class ProcessHeatmapUseCase {
  private readonly logger = new Logger(ProcessHeatmapUseCase.name);

  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string): Promise<JobResponseDto> {
    this.logger.log(`Processing heatmap for job ${jobId}`);

    const job = await this.jobRepository.findById(jobId);
    if (!job) throw new JobNotFoundException(jobId);

    job.markProcessing();
    await this.jobRepository.update(jobId, { status: "processing" });

    try {
      const config = DEFAULT_ALGORITHM_CONFIG;

      const merged = mergeHeatmapSpikes(
        job.heatmapData ?? [],
        config.gap_tolerance,
        config.intensity_tolerance
      );

      const scored = capAndScoreBlocks(
        merged,
        config.min_clip_duration,
        config.max_clip_duration,
        config.target_duration_range,
        config.weight_peak,
        config.weight_avg,
        config.weight_duration_fit
      );

      const selected = selectTopScenes(
        scored,
        config.top_n,
        config.min_spacing
      );

      job.markCompleted(selected);
      await this.jobRepository.update(jobId, {
        status: "completed",
        scenes: selected,
        completedAt: job.completedAt,
      });

      return JobResponseDto.fromEntity(job);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      job.markFailed(message);
      await this.jobRepository.update(jobId, {
        status: "failed",
        errorMessage: message,
      });
      throw error;
    }
  }
}
