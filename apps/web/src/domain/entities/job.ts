export type { ScoredBlock, HeatmapSpike, JobStatus } from "@spikeclips/shared";

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
  status: import("@spikeclips/shared").JobStatus;
  scenes?: import("@spikeclips/shared").ScoredBlock[];
  heatmapData?: import("@spikeclips/shared").HeatmapSpike[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
