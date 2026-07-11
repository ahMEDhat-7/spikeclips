// Spike types
export interface HeatmapSpike {
  start_time: number;
  end_time: number;
  value: number;
}

export interface MergedBlock {
  start_time: number;
  end_time: number;
  duration: number;
  peak_intensity: number;
  avg_intensity: number;
  score: number;
  confidence: "high" | "floor_override";
  capped: boolean;
}

// Job types
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  status: JobStatus;
  scenes?: MergedBlock[];
  heatmapData?: HeatmapSpike[];
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Clip types
export type ClipStatus = "pending" | "processing" | "completed" | "failed";

export interface Clip {
  id: string;
  jobId: string;
  sceneIndex: number;
  startTime: number;
  endTime: number;
  peakIntensity?: number;
  status: ClipStatus;
  fileUrl?: string;
  fileSize?: number;
  duration?: number;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

// User types
export type PlanTier = "free" | "pro" | "team";

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: PlanTier;
  stripeCustomerId?: string;
  analysesUsed: number;
  analysesLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

// Algorithm configuration
export interface AlgorithmConfig {
  gapTolerance: number;
  intensityTolerance: number;
  minIntensityCutoff: number;
  minClipDuration: number;
  maxClipDuration: number;
  targetDurationRange: [number, number];
  topN: number;
  minSpacing: number;
  weightPeak: number;
  weightAvg: number;
  weightDurationFit: number;
}

export const DEFAULT_ALGORITHM_CONFIG: AlgorithmConfig = {
  gapTolerance: 5.0,
  intensityTolerance: 0.25,
  minIntensityCutoff: 0.40,
  minClipDuration: 3.0,
  maxClipDuration: 60.0,
  targetDurationRange: [15.0, 60.0],
  topN: 3,
  minSpacing: 5.0,
  weightPeak: 0.4,
  weightAvg: 0.4,
  weightDurationFit: 0.2,
};
