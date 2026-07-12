export const QUEUE_SERVICE = "QUEUE_SERVICE";

export interface QueueService {
  addAnalysisJob(jobId: string, data: { url: string; userId: string }): Promise<void>;
  addExportJob(jobId: string, data: { clipId: string; sceneIndex: number }): Promise<void>;
}
