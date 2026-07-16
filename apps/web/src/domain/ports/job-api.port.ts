import { ScoredBlock, HeatmapSpike, JobStatus, ClipStatus } from "../entities/job";

export interface JobApiPort {
  createJob(url: string): Promise<JobResponse>;
  getJob(id: string): Promise<JobResponse>;
  getJobs(): Promise<JobResponse[]>;
  processJob(id: string): Promise<JobResponse>;
  exportClips(
    id: string,
    scenes: Array<{ start_time: number; end_time: number; peak_intensity?: number }>
  ): Promise<{ jobId: string; clipJobIds: string[] }>;
  getClips(jobId: string): Promise<ClipResponse[]>;
}

export interface JobResponse {
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

export interface ClipResponse {
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
  createdAt: string;
  completedAt?: string;
}
