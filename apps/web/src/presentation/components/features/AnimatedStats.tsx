"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DataInsightCard } from "./DataInsightCard";
import {
  Clock,
  TrendingUp,
  Scissors,
  BarChart3,
  Timer,
  Zap,
} from "lucide-react";

interface AnimatedStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  videoDuration?: number;
  sceneCount?: number;
  clipCount?: number;
  peakIntensity?: number;
  totalFileSize?: number;
  analysisTime?: number;
}

function AnimatedStats({
  videoDuration,
  sceneCount,
  clipCount,
  peakIntensity,
  totalFileSize,
  analysisTime,
  className,
  ...props
}: AnimatedStatsProps) {
  const stats = React.useMemo(() => {
    const items: {
      label: string;
      value: number;
      format: "number" | "duration" | "bytes";
      icon: typeof Clock;
      variant: "default" | "primary" | "secondary";
    }[] = [];

    if (videoDuration !== undefined) {
      items.push({
        label: "Video Duration",
        value: videoDuration,
        format: "duration",
        icon: Clock,
        variant: "default",
      });
    }

    if (sceneCount !== undefined) {
      items.push({
        label: "Scenes Detected",
        value: sceneCount,
        format: "number",
        icon: BarChart3,
        variant: "primary",
      });
    }

    if (clipCount !== undefined) {
      items.push({
        label: "Clips Generated",
        value: clipCount,
        format: "number",
        icon: Scissors,
        variant: "secondary",
      });
    }

    if (peakIntensity !== undefined) {
      items.push({
        label: "Peak Intensity",
        value: Math.round(peakIntensity * 100),
        format: "number",
        icon: TrendingUp,
        variant: "primary",
      });
    }

    if (totalFileSize !== undefined) {
      items.push({
        label: "Total Size",
        value: totalFileSize,
        format: "bytes",
        icon: Zap,
        variant: "default",
      });
    }

    if (analysisTime !== undefined) {
      items.push({
        label: "Analysis Time",
        value: analysisTime,
        format: "duration",
        icon: Timer,
        variant: "secondary",
      });
    }

    return items;
  }, [
    videoDuration,
    sceneCount,
    clipCount,
    peakIntensity,
    totalFileSize,
    analysisTime,
  ]);

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
        className
      )}
      {...props}
    >
      {stats.map((stat) => (
        <DataInsightCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          format={stat.format}
          icon={stat.icon}
          variant={stat.variant}
          suffix={stat.label === "Peak Intensity" ? "%" : undefined}
        />
      ))}
    </div>
  );
}

export { AnimatedStats };
