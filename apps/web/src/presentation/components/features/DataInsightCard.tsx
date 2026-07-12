"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DataInsightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  suffix?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "primary" | "secondary";
  format?: "number" | "duration" | "bytes";
}

function formatValue(
  value: number | string,
  format: "number" | "duration" | "bytes"
): string {
  if (typeof value === "string") return value;

  switch (format) {
    case "duration": {
      const seconds = value;
      if (seconds < 60) return `${seconds.toFixed(1)}s`;
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    case "bytes": {
      if (value < 1024) return `${value} B`;
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
      return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    }
    default:
      return value.toLocaleString();
  }
}

function DataInsightCard({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
  format = "number",
  className,
  ...props
}: DataInsightCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const isAnimated = typeof value === "number";

  React.useEffect(() => {
    if (!isAnimated) return;
    const target = value;
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, isAnimated]);

  const variantStyles = {
    default: "bg-card border-border",
    primary: "bg-primary/5 border-primary/20",
    secondary: "bg-secondary/5 border-secondary/20",
  };

  const trendStyles = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors hover:bg-surface-hover",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-semibold tracking-tight text-foreground">
              {isAnimated
                ? formatValue(displayValue, format)
                : formatValue(value, format)}
            </span>
            {suffix && (
              <span className="text-sm font-medium text-muted-foreground">
                {suffix}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", trendStyles[trend])}>
          <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

export { DataInsightCard };
