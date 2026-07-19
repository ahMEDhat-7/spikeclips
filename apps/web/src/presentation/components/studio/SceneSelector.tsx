"use client";

import { ScoredBlock } from "@/domain/entities/job";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Film } from "lucide-react";
import { formatTime } from "@/lib/format";
import { TimeRangeSelector } from "./TimeRangeSelector";

interface SceneSelectorProps {
  scenes: ScoredBlock[];
  selectedSceneIndex: number | null;
  onSelectScene: (index: number) => void;
  videoDuration?: number;
  onCustomRange?: (start: number, end: number) => void;
}

export function SceneSelector({
  scenes,
  selectedSceneIndex,
  onSelectScene,
  videoDuration = 0,
  onCustomRange,
}: SceneSelectorProps) {
  if (scenes.length === 0 && !videoDuration) {
    return (
      <div className="space-y-2">
        <div>
          <h2 className="text-base font-semibold">Select a Scene to Edit</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Film className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No scenes were detected. Try a different video or adjust detection sensitivity.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-base font-semibold">Select a Scene to Edit</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click a scene or define a custom time range to start editing.
        </p>
      </div>

      {videoDuration > 0 && onCustomRange && (
        <TimeRangeSelector videoDuration={videoDuration} onApply={onCustomRange} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {scenes.map((scene, i) => {
          const isSelected = selectedSceneIndex === i;

          return (
            <Card
              key={`${scene.start_time}-${scene.end_time}-${i}`}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-muted-foreground/30 hover:bg-muted/30"
              }`}
              onClick={() => onSelectScene(i)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectScene(i);
                }
              }}
            >
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">
                        {i === 0 && scene.start_time === 0 && scene.peak_intensity === 1
                          ? "Custom"
                          : `Scene ${i + 1}`}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono px-1 py-0">
                        {scene.duration.toFixed(1)}s
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {formatTime(scene.start_time)} — {formatTime(scene.end_time)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                        style={{ width: `${scene.peak_intensity * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">
                      {(scene.peak_intensity * 100).toFixed(0)}%
                    </span>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
