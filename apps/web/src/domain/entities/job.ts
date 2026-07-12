export type ScoredBlock = {
  start_time: number;
  end_time: number;
  duration: number;
  peak_intensity: number;
  avg_intensity: number;
  score: number;
  confidence: "high" | "floor_override";
  capped: boolean;
};

export type HeatmapSpike = {
  start_time: number;
  end_time: number;
  value: number;
};

export type JobStatus = "pending" | "processing" | "completed" | "failed";

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
