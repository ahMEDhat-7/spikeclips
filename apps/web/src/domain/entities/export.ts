export type OutputFormat = "mp4" | "webm";
export type OutputQuality = "720p" | "1080p";

export const DEFAULT_OUTPUT_FORMAT: OutputFormat = "mp4";
export const DEFAULT_OUTPUT_QUALITY: OutputQuality = "1080p";

export const OUTPUT_FORMATS: { id: OutputFormat; label: string }[] = [
  { id: "mp4", label: "MP4" },
  { id: "webm", label: "WebM" },
];

export const OUTPUT_QUALITIES: { id: OutputQuality; label: string }[] = [
  { id: "720p", label: "720p" },
  { id: "1080p", label: "1080p" },
];
