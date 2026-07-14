export const QUEUE_SERVICE = "QUEUE_SERVICE";

export interface ExportJobConfig {
  clipId: string;
  sceneIndex: number;
  videoUrl: string;
  startTime: number;
  endTime: number;
  vertical?: boolean;
  platform?: string;
  format?: string;
  quality?: string;
  captions?: Array<{
    text: string;
    font: string;
    size: number;
    color: string;
    position: string;
    startFrame?: number;
    endFrame?: number;
    animation: string;
  }>;
  music?: {
    fileKey: string;
    volume: number;
    originalVolume: number;
    fadeIn: number;
    fadeOut: number;
  };
  templateId?: string;
  templateConfig?: Record<string, unknown>;
}

export interface QueueService {
  addAnalysisJob(jobId: string, data: { url: string; userId: string }): Promise<void>;
  addExportJob(jobId: string, data: ExportJobConfig): Promise<void>;
}
