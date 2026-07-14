import { Injectable, Logger } from "@nestjs/common";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  VideoProcessor,
  CaptionOverlay,
  MusicMixConfig,
} from "../../domain/services/video-processor";

const execFileAsync = promisify(execFile);

@Injectable()
export class FfmpegService implements VideoProcessor {
  private readonly logger = new Logger(FfmpegService.name);

  async trim(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string
  ): Promise<void> {
    this.logger.log(`Trimming ${startTime}-${endTime} to ${outputPath}`);
    const duration = endTime - startTime;

    await execFileAsync("ffmpeg", [
      "-y",
      "-ss", String(startTime),
      "-i", inputPath,
      "-t", String(duration),
      "-c:v", "libx264",
      "-c:a", "aac",
      outputPath,
    ]);
  }

  async reformatToVertical(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string,
    width: number = 1080,
    height: number = 1920
  ): Promise<void> {
    this.logger.log(`Reformatting to ${width}x${height}: ${outputPath}`);
    const duration = endTime - startTime;

    await execFileAsync("ffmpeg", [
      "-y",
      "-ss", String(startTime),
      "-i", inputPath,
      "-t", String(duration),
      "-vf", `crop=ih*9/16:ih,scale=${width}:${height}`,
      "-c:v", "libx264",
      "-c:a", "aac",
      outputPath,
    ]);
  }

  async overlayCaptions(
    inputPath: string,
    outputPath: string,
    captions: CaptionOverlay[],
    videoDuration: number
  ): Promise<void> {
    if (!captions.length) {
      await execFileAsync("cp", [inputPath, outputPath]);
      return;
    }

    const filters: string[] = [];
    for (const cap of captions) {
      const escapedText = cap.text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "'\\\\\\''")
        .replace(/:/g, "\\:");

      let yExpr: string;
      switch (cap.position) {
        case "top": yExpr = "h*0.1"; break;
        case "bottom": yExpr = "h*0.85"; break;
        default: yExpr = "(h-text_h)/2";
      }

      filters.push(
        `drawtext=text='${escapedText}':fontsize=${cap.size}:fontcolor=${cap.color}:x=(w-text_w)/2:y=${yExpr}:enable='between(t,0,${videoDuration})'`
      );
    }

    const filterComplex = filters.join(",");

    await execFileAsync("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-vf", filterComplex,
      "-c:v", "libx264",
      "-c:a", "copy",
      outputPath,
    ]);
  }

  async mixAudio(
    videoPath: string,
    musicPath: string,
    outputPath: string,
    config: MusicMixConfig
  ): Promise<void> {
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", videoPath,
      "-i", musicPath,
      "-filter_complex",
      `[0:a]volume=${config.originalVolume}[orig];` +
      `[1:a]volume=${config.volume},afade=t=in:d=${config.fadeIn},afade=t=out:st=999:d=${config.fadeOut}[music];` +
      `[orig][music]amix=inputs=2:duration=first[aout]`,
      "-map", "0:v",
      "-map", "[aout]",
      "-c:v", "copy",
      "-c:a", "aac",
      outputPath,
    ]);
  }

  async getDuration(filePath: string): Promise<number> {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    return parseFloat(stdout.trim());
  }
}
