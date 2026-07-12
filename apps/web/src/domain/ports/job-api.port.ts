import { ScoredBlock, HeatmapSpike, JobStatus } from "../entities/job";

export interface JobApiPort {
  createJob(url: string, userId: string): Promise<JobResponse>;
  getJob(id: string): Promise<JobResponse>;
  getJobs(userId: string): Promise<JobResponse[]>;
  processJob(id: string): Promise<JobResponse>;
  exportClips(
    id: string,
    sceneIndices: number[]
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
  status: string;
  fileUrl?: string;
  fileSize?: number;
  duration?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
