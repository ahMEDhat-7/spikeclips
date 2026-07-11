"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Scene {
  start: number;
  end: number;
  score: number;
  peakIntensity: number;
  duration?: number;
}

interface SceneListProps {
  scenes: Scene[];
  onSelectionChange?: (selected: Scene[]) => void;
  onExport?: (selected: Scene[]) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SceneList({
  scenes,
  onSelectionChange,
  onExport,
}: SceneListProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleScene = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelected(next);
    onSelectionChange?.(scenes.filter((_, i) => next.has(i)));
  };

  const selectAll = () => {
    const all = new Set(scenes.map((_, i) => i));
    setSelected(all);
    onSelectionChange?.(scenes);
  };

  const deselectAll = () => {
    setSelected(new Set());
    onSelectionChange?.([]);
  };

  const totalDuration = scenes
    .filter((_, i) => selected.has(i))
    .reduce((sum, s) => sum + (s.end - s.start), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Detected Scenes ({scenes.length})
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            Deselect
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {scenes.map((scene, i) => (
          <Card
            key={i}
            className={`cursor-pointer transition-colors ${
              selected.has(i)
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => toggleScene(i)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Checkbox checked={selected.has(i)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {formatTime(scene.start)} – {formatTime(scene.end)}
                    </span>
                    <Badge variant="secondary">
                      {(scene.end - scene.start).toFixed(1)}s
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Peak: {(scene.peakIntensity * 100).toFixed(0)}% · Score:{" "}
                    {scene.score.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            {selected.size} scenes · {totalDuration.toFixed(1)}s total
          </span>
          <Button onClick={() => onExport?.(scenes.filter((_, i) => selected.has(i)))}>
            Export {selected.size} Clips
          </Button>
        </div>
      )}
    </div>
  );
}
