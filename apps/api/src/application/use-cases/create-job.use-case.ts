import { Injectable, Logger, Inject } from "@nestjs/common";
import { Job } from "../../domain/entities/job.entity";
import { YoutubeUrl } from "../../domain/value-objects/youtube-url";
import { JobRepository, JOB_REPOSITORY } from "../../domain/repositories/job.repository";
import { VideoExtractor, VIDEO_EXTRACTOR } from "../../domain/services/video-extractor";
import { JobResponseDto } from "../dto/job-response.dto";

@Injectable()
export class CreateJobUseCase {
  private readonly logger = new Logger(CreateJobUseCase.name);

  constructor(
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepository,
    @Inject(VIDEO_EXTRACTOR) private readonly videoExtractor: VideoExtractor
  ) {}

  async execute(url: string, userId: string): Promise<JobResponseDto> {
    this.logger.log(`Creating job for URL: ${url}`);

    const youtubeUrl = YoutubeUrl.create(url);

    const metadata = await this.videoExtractor.extractMetadata(
      youtubeUrl.toString()
    );

    const job = new Job(
      crypto.randomUUID(),
      userId,
      youtubeUrl.toString(),
      metadata.title,
      metadata.thumbnail,
      metadata.duration,
      metadata.viewCount,
      metadata.uploadDate,
      metadata.channelName,
      "pending",
      undefined,
      metadata.heatmap
    );

    const saved = await this.jobRepository.create(job);

    return JobResponseDto.fromEntity(saved);
  }
}
