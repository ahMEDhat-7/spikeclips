"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { HeatmapSpike, ScoredBlock } from "@/domain/entities/job";

interface HeatmapChartProps {
  heatmap: HeatmapSpike[];
  scenes?: ScoredBlock[];
  onSceneClick?: (scene: ScoredBlock) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function HeatmapChart({
  heatmap,
  scenes = [],
  onSceneClick,
}: HeatmapChartProps) {
  const data = heatmap.map((point) => ({
    time: point.start_time,
    intensity: point.value,
    label: formatTime(point.start_time),
  }));

  return (
    <div className="w-full h-[200px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="intensityGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--primary)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--primary)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <YAxis
            domain={[0, 1]}
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [
              `${(value * 100).toFixed(0)}%`,
              "Intensity",
            ]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="var(--primary)"
            fill="url(#intensityGradient)"
            strokeWidth={2}
          />
          {scenes.map((scene, i) => (
            <ReferenceArea
              key={i}
              x1={formatTime(scene.start_time)}
              x2={formatTime(scene.end_time)}
              fill="var(--destructive)"
              fillOpacity={0.12}
              stroke="var(--destructive)"
              strokeOpacity={0.4}
              strokeWidth={1}
              strokeDasharray="4 2"
              onClick={() => onSceneClick?.(scene)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
