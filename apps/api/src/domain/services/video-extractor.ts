import { HeatmapSpike } from "@spikeclip/shared";

export interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  heatmap: HeatmapSpike[];
}

export interface VideoExtractor {
  extractMetadata(url: string): Promise<VideoMetadata>;
  extractHeatmap(url: string): Promise<HeatmapSpike[]>;
}
