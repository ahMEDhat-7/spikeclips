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

export type TemplateCategoryFilter = TemplateCategory | "all";
