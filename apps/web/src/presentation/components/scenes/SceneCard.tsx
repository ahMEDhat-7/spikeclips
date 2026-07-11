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

export function SceneCard({ scene, index, isSelected, onToggle }: SceneCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "hover:border-muted-foreground/50"
      }`}
      onClick={() => onToggle(index)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Checkbox checked={isSelected} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm">
                {formatTime(scene.start_time)} – {formatTime(scene.end_time)}
              </span>
              <Badge variant="secondary">
                {(scene.end_time - scene.start_time).toFixed(1)}s
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Peak: {(scene.peak_intensity * 100).toFixed(0)}% · Score:{" "}
              {scene.score.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
