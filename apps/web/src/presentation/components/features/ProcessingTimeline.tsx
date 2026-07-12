"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, Circle } from "lucide-react";

type StepStatus = "pending" | "active" | "completed" | "error";

interface Step {
  label: string;
  description?: string;
  duration?: number;
}

interface ProcessingTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  status: StepStatus;
}

function ProcessingTimeline({
  steps,
  currentStep,
  status,
  className,
  ...props
}: ProcessingTimelineProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative">
        {steps.map((step, index) => {
          const stepStatus: StepStatus =
            status === "error" && index === currentStep
              ? "error"
              : index < currentStep
                ? "completed"
                : index === currentStep
                  ? status === "completed"
                    ? "completed"
                    : "active"
                  : "pending";

          return (
            <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[15px] top-8 h-full w-px transition-colors duration-500",
                    stepStatus === "completed" ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  stepStatus === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  stepStatus === "active" &&
                    "border-primary bg-primary/10 text-primary",
                  stepStatus === "error" &&
                    "border-destructive bg-destructive text-destructive-foreground",
                  stepStatus === "pending" && "border-border bg-background text-muted-foreground"
                )}
              >
                {stepStatus === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : stepStatus === "active" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : stepStatus === "error" ? (
                  <Circle className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-mono">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      stepStatus === "active" && "text-foreground",
                      stepStatus === "completed" && "text-primary",
                      stepStatus === "pending" && "text-muted-foreground",
                      stepStatus === "error" && "text-destructive"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.duration !== undefined && stepStatus === "completed" && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {step.duration < 1000
                        ? `${step.duration}ms`
                        : `${(step.duration / 1000).toFixed(1)}s`}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ProcessingTimeline };
export type { Step, StepStatus };
