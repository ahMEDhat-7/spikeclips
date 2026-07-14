"use client";

import { useMemo } from "react";
import { ScoredBlock } from "@/domain/entities/job";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Square, CheckSquare, Film } from "lucide-react";

interface SceneSelectorProps {
  scenes: ScoredBlock[];
  selectedScenes: number[];
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SceneSelector({
  scenes,
  selectedScenes,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: SceneSelectorProps) {
  const selectedSet = useMemo(() => new Set(selectedScenes), [selectedScenes]);

  if (scenes.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Select Scenes</h2>
          <p className="text-sm text-muted-foreground">
            Choose which scenes to include in your clip.
          </p>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Film className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No scenes were detected. Try adjusting the algorithm or manually add scenes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Select Scenes</h2>
          <p className="text-sm text-muted-foreground">
            Choose which scenes to include in your clip.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            <CheckSquare className="h-4 w-4 mr-1" />
            All
          </Button>
          <Button variant="outline" size="sm" onClick={onDeselectAll}>
            <Square className="h-4 w-4 mr-1" />
            None
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <Badge variant="secondary" className="font-mono mr-1">
          {selectedScenes.length}/{scenes.length}
        </Badge>
        scenes selected
      </div>

      <p className="text-xs text-muted-foreground italic">
        Scenes will be exported in this order.
      </p>

      <div className="space-y-2">
        {scenes.map((scene, i) => {
          const isSelected = selectedSet.has(i);

          return (
            <Card
              key={`${scene.start_time}-${scene.end_time}-${i}`}
              className={`cursor-pointer transition-all ${
                isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
              }`}
              onClick={() => onToggle(i)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle(i);
                }
              }}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Scene {i + 1}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {scene.duration.toFixed(1)}s
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatTime(scene.start_time)} — {formatTime(scene.end_time)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                      style={{ width: `${scene.peak_intensity * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                    {(scene.peak_intensity * 100).toFixed(0)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
