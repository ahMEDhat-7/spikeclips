"use client";

import { ScoredBlock } from "@/domain/entities/job";
import { useSceneSelection } from "@/application/hooks/use-scene-selection";
import { SceneCard } from "./SceneCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SceneListProps {
  scenes: ScoredBlock[];
  onExport?: (selected: ScoredBlock[]) => void;
}

export function SceneList({ scenes, onExport }: SceneListProps) {
  const {
    selectedIndices,
    selectedScenes,
    totalDuration,
    toggleScene,
    selectAll,
    deselectAll,
    isSelected,
  } = useSceneSelection(scenes);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scenes.map((scene, i) => (
          <SceneCard
            key={i}
            scene={scene}
            index={i}
            isSelected={isSelected(i)}
            onToggle={toggleScene}
          />
        ))}
      </div>

      {selectedIndices.size > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedIndices.size} scenes
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalDuration.toFixed(1)}s total
            </span>
          </div>
          <Button onClick={() => onExport?.(selectedScenes)}>
            Export {selectedIndices.size} Clips
          </Button>
        </div>
      )}
    </div>
  );
}
