import { TemplateCategoryFilter, TextAnimation, TransitionType, LayoutType, TextStyle } from "@/domain/entities/template";

export const TEMPLATE_CATEGORIES: { id: TemplateCategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kinetic", label: "Kinetic" },
  { id: "collage", label: "Collage" },
  { id: "split", label: "Split" },
  { id: "pov", label: "POV" },
  { id: "loop", label: "Loop" },
];

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

export const TEMPLATE_TEXT_STYLES: { id: TextStyle; label: string }[] = [
  { id: "bold", label: "Bold" },
  { id: "outlined", label: "Outlined" },
  { id: "shadow", label: "Shadow" },
  { id: "neon", label: "Neon" },
];
