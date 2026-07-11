import { ScoredBlock, HeatmapSpike, JobStatus } from "@spikeclip/shared";

export interface Job {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  status: JobStatus;
  scenes?: ScoredBlock[];
  heatmapData?: HeatmapSpike[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export type { ScoredBlock, HeatmapSpike, JobStatus };
