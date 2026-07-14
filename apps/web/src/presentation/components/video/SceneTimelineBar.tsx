"use client";

import { ScoredBlock } from "@/domain/entities/job";

interface SceneTimelineBarProps {
  duration: number;
  scenes: ScoredBlock[];
  currentTime: number;
  selectedSceneIndex?: number;
  onSceneClick: (index: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SceneTimelineBar({
  duration,
  scenes,
  currentTime,
  selectedSceneIndex,
  onSceneClick,
}: SceneTimelineBarProps) {
  if (duration <= 0) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="relative h-8 bg-muted rounded-md overflow-hidden cursor-pointer">
        {scenes.map((scene, i) => {
          const left = (scene.start_time / duration) * 100;
          const width = ((scene.end_time - scene.start_time) / duration) * 100;
          const isSelected = i === selectedSceneIndex;

          return (
            <div
              key={`${scene.start_time}-${scene.end_time}-${i}`}
              className={`absolute top-0 h-full rounded-sm cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary/80 ring-2 ring-primary z-10"
                  : "bg-primary/40 hover:bg-primary/60"
              }`}
              style={{ left: `${left}%`, width: `${width}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSceneClick(i);
              }}
              title={`Scene ${i + 1}: ${formatTime(scene.start_time)} — ${formatTime(scene.end_time)}`}
            />
          );
        })}

        <div
          className="absolute top-0 h-full w-0.5 bg-foreground z-20 pointer-events-none"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-muted-foreground px-0.5">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
