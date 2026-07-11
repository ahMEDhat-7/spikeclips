"use client";

import { useState, useCallback } from "react";
import { ScoredBlock } from "../../domain/entities/job";

export function useSceneSelection(scenes: ScoredBlock[] = []) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set()
  );

  const toggleScene = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(scenes.map((_, i) => i)));
  }, [scenes]);

  const deselectAll = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const selectedScenes = scenes.filter((_, i) => selectedIndices.has(i));

  const totalDuration = selectedScenes.reduce(
    (sum, s) => sum + (s.end_time - s.start_time),
    0
  );

  return {
    selectedIndices,
    selectedScenes,
    totalDuration,
    toggleScene,
    selectAll,
    deselectAll,
    isSelected: (index: number) => selectedIndices.has(index),
  };
}
