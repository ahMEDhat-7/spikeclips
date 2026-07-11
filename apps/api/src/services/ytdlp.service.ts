import { Injectable, Logger } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  heatmap: { start_time: number; end_time: number; value: number }[];
}

@Injectable()
export class YtdlpService {
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
      heatmap: metadata.heatmap || [],
    };
  }

  async extractHeatmap(url: string): Promise<VideoMetadata["heatmap"]> {
    this.logger.log(`Extracting heatmap for: ${url}`);

    const { stdout } = await execAsync(
      `yt-dlp -j --no-download "${url}"`
    );

    const metadata = JSON.parse(stdout);
    return metadata.heatmap || [];
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

    const duration = endTime - startTime;
    await execAsync(
      `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" ` +
        `--download-sections "*${startTime}-${endTime}" ` +
        `--force-keyframes-at-cuts ` +
        `-o "${outputPath}" "${url}"`
    );
  }

  isValidYouTubeUrl(url: string): boolean {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&?#]+)/,
    ];
    return patterns.some((p) => p.test(url));
  }
}
