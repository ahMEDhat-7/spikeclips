"use client";

import { StudioStep } from "@/application/hooks/use-studio";
import {
  LayoutGrid,
  Film,
  Type,
  Music,
  Sparkles,
  Download,
} from "lucide-react";

const TOOLS: { step: StudioStep; icon: React.ElementType; label: string }[] = [
  { step: "platform", icon: LayoutGrid, label: "Platform" },
  { step: "scenes", icon: Film, label: "Scenes" },
  { step: "captions", icon: Type, label: "Captions" },
  { step: "music", icon: Music, label: "Music" },
  { step: "templates", icon: Sparkles, label: "Templates" },
  { step: "export", icon: Download, label: "Export" },
];

interface ToolPaletteProps {
  currentStep: StudioStep;
  onStepChange: (step: StudioStep) => void;
}

export function ToolPalette({ currentStep, onStepChange }: ToolPaletteProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 px-1">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentStep === tool.step;

        return (
          <div key={tool.step} className="relative group">
            <button
              className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => onStepChange(tool.step)}
              aria-label={tool.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon className="h-4 w-4" />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {tool.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
