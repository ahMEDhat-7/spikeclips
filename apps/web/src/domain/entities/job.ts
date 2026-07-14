export type { ScoredBlock, HeatmapSpike, JobStatus, Clip, ClipStatus } from "@spikeclips/shared";

import type { JobStatus, ScoredBlock, HeatmapSpike } from "@spikeclips/shared";

export interface Job {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  videoViewCount?: number;
  videoUploadDate?: string;
  videoChannelName?: string;
  status: JobStatus;
  scenes?: ScoredBlock[];
  heatmapData?: HeatmapSpike[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
