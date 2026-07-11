import { Injectable, Logger } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import {
  VideoExtractor,
  VideoMetadata,
} from "../../domain/services/video-extractor";
import { HeatmapSpike } from "@spikeclip/shared";

const execAsync = promisify(exec);

@Injectable()
export class YtdlpService implements VideoExtractor {
  private readonly logger = new Logger(YtdlpService.name);

  async extractMetadata(url: string): Promise<VideoMetadata> {
    this.logger.log(`Extracting metadata for: ${url}`);

    const { stdout } = await execAsync(
      `yt-dlp -j --write-info-json --no-download "${url}"`
    );

    const metadata = JSON.parse(stdout);

    return {
      id: metadata.id,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      heatmap: (metadata.heatmap ?? []) as HeatmapSpike[],
    };
  }

  async extractHeatmap(url: string): Promise<HeatmapSpike[]> {
    this.logger.log(`Extracting heatmap for: ${url}`);

    const { stdout } = await execAsync(
      `yt-dlp -j --no-download "${url}"`
    );

    const metadata = JSON.parse(stdout);
    return (metadata.heatmap ?? []) as HeatmapSpike[];
  }

  async downloadSection(
    url: string,
    startTime: number,
    endTime: number,
    outputPath: string
  ): Promise<void> {
    this.logger.log(
      `Downloading section ${startTime}-${endTime} from: ${url}`
    );

    await execAsync(
      `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" ` +
        `--download-sections "*${startTime}-${endTime}" ` +
        `--force-keyframes-at-cuts ` +
        `-o "${outputPath}" "${url}"`
    );
  }
}
