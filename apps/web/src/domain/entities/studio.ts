export type StudioStep = "platform" | "scenes" | "captions" | "music" | "templates" | "export";

export const STUDIO_STEPS: StudioStep[] = ["platform", "scenes", "captions", "music", "templates", "export"];

export const STEP_LABELS: Record<StudioStep, string> = {
  platform: "Platform",
  scenes: "Scenes",
  captions: "Captions",
  music: "Music",
  templates: "Templates",
  export: "Export",
};
