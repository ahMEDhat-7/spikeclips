import { Injectable, Logger } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface TrimOptions {
  startTime: number;
  endTime: number;
  outputPath: string;
}

export interface ReformatOptions extends TrimOptions {
  width?: number;
  height?: number;
}

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  async trim(
    inputPath: string,
    options: TrimOptions
  ): Promise<void> {
    this.logger.log(
      `Trimming ${options.startTime}-${options.endTime} to ${options.outputPath}`
    );

    const duration = options.endTime - options.startTime;

    await execAsync(
      `ffmpeg -y -ss ${options.startTime} -i "${inputPath}" ` +
        `-t ${duration} ` +
        `-c:v libx264 -c:a aac ` +
        `--force-keyframes-at-cuts ` +
        `"${options.outputPath}"`
    );
  }

  async reformatToVertical(
    inputPath: string,
    options: ReformatOptions
  ): Promise<void> {
    const width = options.width || 1080;
    const height = options.height || 1920;

    this.logger.log(
      `Reformatting to ${width}x${height}: ${options.outputPath}`
    );

    const duration = options.endTime - options.startTime;

    await execAsync(
      `ffmpeg -y -ss ${options.startTime} -i "${inputPath}" ` +
        `-t ${duration} ` +
        `-vf "crop=ih*9/16:ih,scale=${width}:${height}" ` +
        `-c:v libx264 -c:a aac ` +
        `--force-keyframes-at-cuts ` +
        `"${options.outputPath}"`
    );
  }

  async trimAndReformat(
    inputPath: string,
    options: ReformatOptions
  ): Promise<void> {
    const width = options.width || 1080;
    const height = options.height || 1920;

    this.logger.log(
      `Trimming and reformatting to ${width}x${height}: ${options.outputPath}`
    );

    const duration = options.endTime - options.startTime;

    await execAsync(
      `ffmpeg -y -ss ${options.startTime} -i "${inputPath}" ` +
        `-t ${duration} ` +
        `-vf "crop=ih*9/16:ih,scale=${width}:${height}" ` +
        `-c:v libx264 -c:a aac ` +
        `--force-keyframes-at-cuts ` +
        `"${options.outputPath}"`
    );
  }

  async getDuration(filePath: string): Promise<number> {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout.trim());
  }
}
