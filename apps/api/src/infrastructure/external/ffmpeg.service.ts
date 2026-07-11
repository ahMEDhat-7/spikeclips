import { Injectable, Logger } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";
import { VideoProcessor } from "../../domain/services/video-processor";

const execAsync = promisify(exec);

@Injectable()
export class FfmpegService implements VideoProcessor {
  private readonly logger = new Logger(FfmpegService.name);

  async trim(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string
  ): Promise<void> {
    this.logger.log(
      `Trimming ${startTime}-${endTime} to ${outputPath}`
    );

    const duration = endTime - startTime;

    await execAsync(
      `ffmpeg -y -ss ${startTime} -i "${inputPath}" ` +
        `-t ${duration} ` +
        `-c:v libx264 -c:a aac ` +
        `--force-keyframes-at-cuts ` +
        `"${outputPath}"`
    );
  }

  async reformatToVertical(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string,
    width: number = 1080,
    height: number = 1920
  ): Promise<void> {
    this.logger.log(
      `Reformatting to ${width}x${height}: ${outputPath}`
    );

    const duration = endTime - startTime;

    await execAsync(
      `ffmpeg -y -ss ${startTime} -i "${inputPath}" ` +
        `-t ${duration} ` +
        `-vf "crop=ih*9/16:ih,scale=${width}:${height}" ` +
        `-c:v libx264 -c:a aac ` +
        `--force-keyframes-at-cuts ` +
        `"${outputPath}"`
    );
  }

  async getDuration(filePath: string): Promise<number> {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout.trim());
  }
}
