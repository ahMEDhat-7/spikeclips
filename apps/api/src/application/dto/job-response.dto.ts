import { Job } from "../../domain/entities/job.entity";
import { ScoredBlock, HeatmapSpike } from "@spikeclip/shared";

export class JobResponseDto {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  status: string;
  scenes?: ScoredBlock[];
  heatmapData?: HeatmapSpike[];
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;

  static fromEntity(job: Job): JobResponseDto {
    const dto = new JobResponseDto();
    dto.id = job.id;
    dto.userId = job.userId;
    dto.url = job.url;
    dto.videoTitle = job.videoTitle;
    dto.videoThumbnail = job.videoThumbnail;
    dto.videoDuration = job.videoDuration;
    dto.status = job.status;
    dto.scenes = job.scenes;
    dto.heatmapData = job.heatmapData;
    dto.errorMessage = job.errorMessage;
    dto.createdAt = job.createdAt;
    dto.completedAt = job.completedAt;
    return dto;
  }
}
