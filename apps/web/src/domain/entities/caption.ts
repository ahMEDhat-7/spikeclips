export type CaptionFont = "inter" | "impact" | "bebas" | "playfair" | "mono";
export type CaptionPosition = "top" | "center" | "bottom";
export type CaptionTextStyle = "bold" | "outlined" | "shadow" | "neon";
export type CaptionTextAlign = "left" | "center" | "right";

export interface Caption {
  id: string;
  sceneIndex?: number;
  text: string;
  font: CaptionFont;
  size: number;
  color: string;
  position: CaptionPosition;
  textAlign: CaptionTextAlign;
  startFrame: number;
  endFrame: number;
  animation: "pop" | "slide" | "fade" | "none";
  textStyle: CaptionTextStyle;
  opacity: number;
  backgroundColor: string;
  backgroundEnabled: boolean;
  strokeWidth: number;
  shadowRadius: number;
}

export const CAPTION_FONTS: Record<CaptionFont, { label: string; className: string; cssFamily: string }> = {
  inter: { label: "Inter", className: "font-sans", cssFamily: "'Inter', sans-serif" },
  impact: { label: "Impact", className: "font-impact", cssFamily: "'Impact', sans-serif" },
  bebas: { label: "Bebas Neue", className: "font-bebas", cssFamily: "'Bebas Neue', sans-serif" },
  playfair: { label: "Playfair Display", className: "font-playfair", cssFamily: "'Playfair Display', serif" },
  mono: { label: "JetBrains Mono", className: "font-mono", cssFamily: "'JetBrains Mono', monospace" },
};

export const CAPTION_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Gold", value: "#EAB308" },
  { label: "Green", value: "#22C55E" },
  { label: "Cyan", value: "#06B6D4" },
  { label: "Pink", value: "#EC4899" },
  { label: "Purple", value: "#A855F7" },
  { label: "Blue", value: "#3B82F6" },
];

export const TEXT_STYLES: { id: CaptionTextStyle; label: string }[] = [
  { id: "bold", label: "Bold" },
  { id: "outlined", label: "Outlined" },
  { id: "shadow", label: "Shadow" },
  { id: "neon", label: "Neon" },
];

export const TEXT_ALIGNMENTS: { id: CaptionTextAlign; label: string }[] = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

export function createCaption(overrides?: Partial<Caption>): Caption {
  return {
    id: crypto.randomUUID(),
    text: "Your text here",
    font: "inter",
    size: 48,
    color: "#FFFFFF",
    position: "center",
    textAlign: "center",
    startFrame: 0,
    endFrame: 60,
    animation: "pop",
    textStyle: "bold",
    opacity: 1,
    backgroundColor: "#000000",
    backgroundEnabled: false,
    strokeWidth: 0,
    shadowRadius: 0,
    ...overrides,
  };
}
