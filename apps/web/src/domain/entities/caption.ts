export type CaptionPosition = "top" | "center" | "bottom";
export type CaptionFont = "inter" | "impact" | "bebas" | "playfair" | "mono";

export interface Caption {
  id: string;
  sceneId?: string;
  text: string;
  font: CaptionFont;
  size: number;
  color: string;
  position: CaptionPosition;
  startFrame: number;
  endFrame: number;
  animation: "pop" | "slide" | "fade" | "none";
}

export const CAPTION_FONTS: { id: CaptionFont; label: string; className: string }[] = [
  { id: "inter", label: "Inter", className: "font-sans" },
  { id: "impact", label: "Impact", className: "font-sans font-black" },
  { id: "bebas", label: "Bebas Neue", className: "font-sans font-bold tracking-wider" },
  { id: "playfair", label: "Playfair", className: "font-serif" },
  { id: "mono", label: "JetBrains Mono", className: "font-mono" },
];

export const CAPTION_COLORS = [
  "#FFFFFF",
  "#000000",
  "#E63946",
  "#FF6B35",
  "#FFD700",
  "#00FF00",
  "#00BFFF",
  "#FF69B4",
];

export function createCaption(overrides?: Partial<Caption>): Caption {
  return {
    id: crypto.randomUUID(),
    text: "Your text here",
    font: "inter",
    size: 48,
    color: "#FFFFFF",
    position: "center",
    startFrame: 0,
    endFrame: 60,
    animation: "pop",
    ...overrides,
  };
}
