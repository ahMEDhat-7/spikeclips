export interface JobApiPort {
  createJob(url: string, userId: string): Promise<JobResponse>;
  getJob(id: string): Promise<JobResponse>;
  getJobs(userId: string): Promise<JobResponse[]>;
  processJob(id: string): Promise<JobResponse>;
  exportClips(
    id: string,
    sceneIndices: number[]
  ): Promise<{ jobId: string; clipJobIds: string[] }>;
}

export interface JobResponse {
  id: string;
  userId: string;
  url: string;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  status: string;
  scenes?: any[];
  heatmapData?: any[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}
