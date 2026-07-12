"use client";

import { ScoredBlock } from "@/domain/entities/job";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface SceneCardProps {
  scene: ScoredBlock;
  index: number;
  isSelected: boolean;
  onToggle: (index: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SceneCard({
  scene,
  index,
  isSelected,
  onToggle,
}: SceneCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "hover:border-muted-foreground/50 hover:bg-surface-hover"
      }`}
      onClick={() => onToggle(index)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox checked={isSelected} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-medium">
                {formatTime(scene.start_time)} – {formatTime(scene.end_time)}
              </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {(scene.end_time - scene.start_time).toFixed(1)}s
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              <span>
                Peak:{" "}
                <span className="font-mono font-medium text-foreground">
                  {(scene.peak_intensity * 100).toFixed(0)}%
                </span>
              </span>
              <span className="text-border">·</span>
              <span>
                Score:{" "}
                <span className="font-mono font-medium text-foreground">
                  {scene.score.toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
