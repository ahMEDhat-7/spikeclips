"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: string;
  showPercentage?: boolean;
  variant?: "default" | "success" | "warning" | "destructive";
  size?: "sm" | "default" | "lg";
}

function Progress({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  showPercentage = false,
  variant = "default",
  size = "default",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  const sizeStyles = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && !indeterminate && (
            <span className="text-sm font-mono text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          sizeStyles[size]
        )}
      >
        {indeterminate ? (
          <div
            className={cn(
              "h-full rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite]",
              variantStyles[variant]
            )}
          />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              variantStyles[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

function ProgressStep({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? "completed"
            : index === currentStep
              ? "active"
              : "pending";

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                  status === "completed" && "bg-primary text-primary-foreground",
                  status === "active" &&
                    "bg-primary/20 text-primary ring-2 ring-primary",
                  status === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {status === "completed" ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  status === "active" && "text-foreground",
                  status === "completed" && "text-primary",
                  status === "pending" && "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 min-w-4 transition-colors",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { Progress, ProgressStep };
