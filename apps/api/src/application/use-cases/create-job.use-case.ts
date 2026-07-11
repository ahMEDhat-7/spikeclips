import { Injectable, Logger } from "@nestjs/common";
import { Job } from "../../domain/entities/job.entity";
import { YoutubeUrl } from "../../domain/value-objects/youtube-url";
import { JobRepository } from "../../domain/repositories/job.repository";
import { VideoExtractor } from "../../domain/services/video-extractor";
import { QueueService } from "../../domain/services/queue";
import { JobResponseDto } from "../dto/job-response.dto";

@Injectable()
export class CreateJobUseCase {
  private readonly logger = new Logger(CreateJobUseCase.name);

  constructor(
    private readonly jobRepository: JobRepository,
    private readonly videoExtractor: VideoExtractor,
    private readonly queueService: QueueService
  ) {}

  async execute(url: string, userId: string): Promise<JobResponseDto> {
    this.logger.log(`Creating job for URL: ${url}`);

    // Validate URL
    const youtubeUrl = YoutubeUrl.create(url);

    // Extract video metadata
    const metadata = await this.videoExtractor.extractMetadata(
      youtubeUrl.toString()
    );

    // Create job entity
    const job = new Job(
      crypto.randomUUID(),
      userId,
      youtubeUrl.toString(),
      metadata.title,
      metadata.thumbnail,
      metadata.duration,
      "pending",
      undefined,
      metadata.heatmap
    );

    // Persist
    const saved = await this.jobRepository.create(job);

    // Queue for processing
    await this.queueService.addAnalysisJob(saved.id, {
      url: youtubeUrl.toString(),
      userId,
    });

    return JobResponseDto.fromEntity(saved);
  }
}
