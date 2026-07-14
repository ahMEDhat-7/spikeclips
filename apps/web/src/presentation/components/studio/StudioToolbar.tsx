"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudioStep } from "@/application/hooks/use-studio";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  RotateCcw,
  LayoutDashboard,
} from "lucide-react";

interface StudioToolbarProps {
  currentStep: StudioStep;
  currentStepIndex: number;
  steps: StudioStep[];
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onGoNext: () => void;
  onGoPrev: () => void;
  onGoToStep: (step: StudioStep) => void;
  onExport: (config?: { format: string; quality: string }) => void;
  onReset: () => void;
  isExporting?: boolean;
  outputFormat?: string;
  outputQuality?: string;
}

const STEP_LABELS: Record<StudioStep, string> = {
  platform: "Platform",
  scenes: "Scenes",
  captions: "Captions",
  music: "Music",
  templates: "Templates",
  export: "Export",
};

export function StudioToolbar({
  currentStep,
  currentStepIndex,
  steps,
  canGoNext,
  canGoPrev,
  isFirstStep,
  isLastStep,
  onGoNext,
  onGoPrev,
  onGoToStep,
  onExport,
  onReset,
  isExporting,
  outputFormat = "mp4",
  outputQuality = "1080p",
}: StudioToolbarProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="h-4 w-px bg-border" />
        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Reset all?</span>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onReset();
                setShowResetConfirm(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowResetConfirm(false)}
            >
              No
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        {steps.map((step, i) => {
          const isCurrent = i === currentStepIndex;
          const isCompleted = i < currentStepIndex;
          return (
            <div key={step} className="flex items-center">
              <button
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => onGoToStep(step)}
                title={STEP_LABELS[step]}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`w-4 h-0.5 mx-0.5 ${
                    i < currentStepIndex ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onGoPrev} disabled={!canGoPrev}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {isLastStep ? (
          <Button
            size="sm"
            onClick={() => onExport({ format: outputFormat, quality: outputQuality })}
            disabled={isExporting}
            className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white font-semibold"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        ) : (
          <Button size="sm" onClick={onGoNext} disabled={!canGoNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
