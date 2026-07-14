export interface CaptionOverlay {
  text: string;
  font: string;
  size: number;
  color: string;
  position: string;
  animation: string;
}

export interface MusicMixConfig {
  fileKey: string;
  volume: number;
  originalVolume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface VideoProcessor {
  trim(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string
  ): Promise<void>;

  reformatToVertical(
    inputPath: string,
    startTime: number,
    endTime: number,
    outputPath: string,
    width?: number,
    height?: number
  ): Promise<void>;

  overlayCaptions(
    inputPath: string,
    outputPath: string,
    captions: CaptionOverlay[],
    videoDuration: number
  ): Promise<void>;

  mixAudio(
    videoPath: string,
    audioPath: string,
    outputPath: string,
    config: MusicMixConfig
  ): Promise<void>;

  getDuration(filePath: string): Promise<number>;
}
