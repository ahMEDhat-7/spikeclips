"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ScoredBlock } from "@/domain/entities/job";

export interface EditableScene {
  start_time: number;
  end_time: number;
  peak_intensity: number;
  score: number;
  isCustom: boolean;
}

export type AddMode = "idle" | "waiting_for_end";

export function useSceneEditor(
  suggestedScenes: ScoredBlock[],
  scenesLimit: number,
  onScenesChange?: (scenes: EditableScene[]) => void
) {
  const [scenes, setScenes] = useState<EditableScene[]>(() =>
    suggestedScenes.map((s) => ({
      start_time: s.start_time,
      end_time: s.end_time,
      peak_intensity: s.peak_intensity,
      score: s.score,
      isCustom: false,
    }))
  );

  const [addMode, setAddMode] = useState<AddMode>("idle");
  const [addStart, setAddStart] = useState<number | null>(null);

  const canAddMore = scenes.length < scenesLimit;

  useEffect(() => {
    onScenesChange?.(scenes);
  }, [scenes, onScenesChange]);

  const startAddScene = useCallback((time: number) => {
    setAddMode("waiting_for_end");
    setAddStart(time);
  }, []);

  const finishAddScene = useCallback((time: number) => {
    if (addStart === null) return;
    if (!canAddMore) return;
    const start = Math.min(addStart, time);
    const end = Math.max(addStart, time);

    if (end - start < 1) {
      setAddMode("idle");
      setAddStart(null);
      return;
    }

    const newScene: EditableScene = {
      start_time: start,
      end_time: end,
      peak_intensity: 0,
      score: 0,
      isCustom: true,
    };

    setScenes((prev) => {
      const updated = [...prev, newScene];
      updated.sort((a, b) => a.start_time - b.start_time);
      return updated;
    });

    setAddMode("idle");
    setAddStart(null);
  }, [addStart, canAddMore]);

  const cancelAddScene = useCallback(() => {
    setAddMode("idle");
    setAddStart(null);
  }, []);

  const updateSceneTime = useCallback((index: number, field: "start_time" | "end_time", time: number) => {
    setScenes((prev) => {
      const updated = prev.map((s, i) => {
        if (i !== index) return s;
        const next = { ...s, [field]: time };
        if (next.end_time <= next.start_time) return s;
        return next;
      });
      return updated;
    });
  }, []);

  const removeScene = useCallback((index: number) => {
    setScenes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetToSuggestions = useCallback(() => {
    const reset = suggestedScenes.map((s) => ({
      start_time: s.start_time,
      end_time: s.end_time,
      peak_intensity: s.peak_intensity,
      score: s.score,
      isCustom: false,
    }));
    setScenes(reset);
  }, [suggestedScenes]);

  const totalDuration = useMemo(
    () => scenes.reduce((sum, s) => sum + (s.end_time - s.start_time), 0),
    [scenes]
  );

  return {
    scenes,
    addMode,
    addStart,
    canAddMore,
    totalDuration,
    startAddScene,
    finishAddScene,
    cancelAddScene,
    updateSceneTime,
    removeScene,
    resetToSuggestions,
  };
}
