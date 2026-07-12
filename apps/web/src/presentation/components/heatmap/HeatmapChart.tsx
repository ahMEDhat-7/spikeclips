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
                stopColor="#E63946"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#E63946"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient
              id="sceneGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#FF6B35"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="#FF6B35"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="label"
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            fontFamily="var(--font-mono)"
          />
          <YAxis
            domain={[0, 1]}
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            fontFamily="var(--font-mono)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
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
            stroke="#E63946"
            fill="url(#intensityGradient)"
            strokeWidth={2}
          />
          {scenes.map((scene, i) => (
            <ReferenceArea
              key={i}
              x1={formatTime(scene.start_time)}
              x2={formatTime(scene.end_time)}
              fill="url(#sceneGradient)"
              stroke="#FF6B35"
              strokeOpacity={0.6}
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
