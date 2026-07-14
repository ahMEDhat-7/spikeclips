import { EditTemplate } from "../entities/template";

export const TEMPLATES: EditTemplate[] = [
  {
    id: "kinetic-typography",
    name: "Kinetic Typography",
    description:
      "Punchy, animated text that changes dynamically. Words pop up one by one or phrase by phrase, often highlighted with bold colors and varied fonts. Perfect for educational content, listicles, and tech reviews.",
    category: "kinetic",
    preview: "/templates/kinetic.svg",
    config: {
      textAnimation: "pop",
      transitionIn: "fade",
      transitionOut: "fade",
      layout: "full",
      textPosition: "center",
      textStyle: "bold",
      overlayEffects: ["word-by-word", "color-highlight"],
    },
  },
  {
    id: "photo-dump",
    name: "Photo Dumps & Collages",
    description:
      "A grid layout or rapidly changing series of 3 to 10 photos/short clips synced to an upbeat trending audio track. Creates a slice-of-life or behind-the-scenes aesthetic.",
    category: "collage",
    preview: "/templates/collage.svg",
    config: {
      textAnimation: "slide",
      transitionIn: "cut",
      transitionOut: "cut",
      layout: "grid",
      textPosition: "bottom",
      textStyle: "outlined",
      overlayEffects: ["grid-sync", "photo-flash"],
    },
  },
  {
    id: "split-screen",
    name: "Split-Screen Commentary",
    description:
      "The screen is split in half. Top half features a reaction, talking head, or B-roll. Bottom half displays gameplay, podcast excerpt, or article. Provides constant visual stimulation.",
    category: "split",
    preview: "/templates/split.svg",
    config: {
      textAnimation: "fade",
      transitionIn: "slide",
      transitionOut: "slide",
      layout: "split-horizontal",
      textPosition: "top",
      textStyle: "shadow",
      overlayEffects: ["dual-content", "reaction-cam"],
    },
  },
  {
    id: "pov",
    name: "POV (First-Person)",
    description:
      'Text overlays that start with "POV:". The camera acts as a first-person viewer experiencing a specific, relatable, or exaggerated scenario. Highly engaging and shareable.',
    category: "pov",
    preview: "/templates/pov.svg",
    config: {
      textAnimation: "pop",
      transitionIn: "zoom",
      transitionOut: "fade",
      layout: "full",
      textPosition: "top",
      textStyle: "shadow",
      overlayEffects: ["pov-label", "vignette"],
    },
  },
  {
    id: "transition-loop",
    name: "Transition Loops",
    description:
      "A video sequence that connects the end of the clip to the beginning, creating a seamless infinite loop. Artificially inflates watch time and completion rate for algorithm boosting.",
    category: "loop",
    preview: "/templates/loop.svg",
    config: {
      textAnimation: "none",
      transitionIn: "fade",
      transitionOut: "fade",
      layout: "full",
      textPosition: "bottom",
      textStyle: "bold",
      overlayEffects: ["seamless-loop", "crossfade-blend"],
    },
  },
];

export function getTemplatesByCategory(category: EditTemplate["category"]): EditTemplate[] {
  return TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string): EditTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
