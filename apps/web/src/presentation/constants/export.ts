import { OutputFormat, OutputQuality } from "@/domain/entities/export";

export const OUTPUT_FORMATS: { id: OutputFormat; label: string }[] = [
  { id: "mp4", label: "MP4" },
  { id: "webm", label: "WebM" },
];

export const OUTPUT_QUALITIES: { id: OutputQuality; label: string }[] = [
  { id: "720p", label: "720p" },
  { id: "1080p", label: "1080p" },
];
