import { Job } from "../../domain/entities/job.entity";
import { JobStatus, ScoredBlock, HeatmapSpike } from "@spikeclips/shared";

interface PrismaJob {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string | null;
  videoThumbnail?: string | null;
  videoDuration?: number | null;
  status: string;
  scenes?: unknown;
  heatmapData?: unknown;
  errorMessage?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}

export class JobMapper {
  static toEntity(prismaJob: PrismaJob): Job {
    return new Job(
      prismaJob.id,
      prismaJob.userId,
      prismaJob.url,
      prismaJob.videoTitle ?? undefined,
      prismaJob.videoThumbnail ?? undefined,
      prismaJob.videoDuration ?? undefined,
      prismaJob.status as JobStatus,
      (prismaJob.scenes as ScoredBlock[]) ?? undefined,
      (prismaJob.heatmapData as HeatmapSpike[]) ?? undefined,
      prismaJob.errorMessage ?? undefined,
      prismaJob.createdAt,
      prismaJob.completedAt ?? undefined
    );
  }

  static toPersistence(job: Job): Record<string, unknown> {
    return {
      id: job.id,
      userId: job.userId,
      url: job.url,
      videoTitle: job.videoTitle,
      videoThumbnail: job.videoThumbnail,
      videoDuration: job.videoDuration,
      status: job.status,
      scenes: job.scenes,
      heatmapData: job.heatmapData,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
    };
  }
}
