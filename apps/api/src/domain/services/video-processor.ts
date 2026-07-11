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

  getDuration(filePath: string): Promise<number>;
}
