export type TemplateCategory = "kinetic" | "collage" | "split" | "pov" | "loop";
export type TextAnimation = "pop" | "slide" | "fade" | "none";
export type TransitionType = "cut" | "fade" | "slide" | "zoom";
export type LayoutType = "full" | "split-horizontal" | "split-vertical" | "grid";
export type TextStyle = "bold" | "outlined" | "shadow" | "neon";

export interface TemplateConfig {
  textAnimation: TextAnimation;
  transitionIn: TransitionType;
  transitionOut: TransitionType;
  layout: LayoutType;
  textPosition: "top" | "center" | "bottom";
  textStyle: TextStyle;
  overlayEffects: string[];
}

export interface EditTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  preview: string;
  config: TemplateConfig;
}

export const TEXT_ANIMATIONS: { id: TextAnimation; label: string }[] = [
  { id: "pop", label: "Pop" },
  { id: "slide", label: "Slide" },
  { id: "fade", label: "Fade" },
  { id: "none", label: "None" },
];

export const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: "cut", label: "Cut" },
  { id: "fade", label: "Fade" },
  { id: "slide", label: "Slide" },
  { id: "zoom", label: "Zoom" },
];

export const LAYOUTS: { id: LayoutType; label: string }[] = [
  { id: "full", label: "Full Screen" },
  { id: "split-horizontal", label: "Split Horizontal" },
  { id: "split-vertical", label: "Split Vertical" },
  { id: "grid", label: "Grid (2x2)" },
];

export const TEXT_STYLES: { id: TextStyle; label: string }[] = [
  { id: "bold", label: "Bold" },
  { id: "outlined", label: "Outlined" },
  { id: "shadow", label: "Shadow" },
  { id: "neon", label: "Neon" },
];
