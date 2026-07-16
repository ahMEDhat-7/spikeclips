import { CaptionOverlay } from "../../domain/services/video-processor";

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

function formatSrtTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const ms = Math.round((totalSeconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${ms.toString().padStart(3, "0")}`;
}

export function generateSrt(
  captions: CaptionOverlay[],
  fps: number = 30,
  videoDuration?: number
): string {
  const totalFrames = videoDuration ? Math.round(videoDuration * fps) : fps * 10;
  return captions
    .map((cap, i) => {
      const startFrame = cap.startFrame ?? 0;
      const endFrame = cap.endFrame ?? totalFrames;
      const start = formatSrtTime(startFrame / fps);
      const end = formatSrtTime(endFrame / fps);
      return `${i + 1}\n${start} --> ${end}\n${cap.text}\n\n`;
    })
    .join("\n");
}
