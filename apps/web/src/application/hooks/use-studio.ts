"use client";

import { useState, useCallback, useMemo } from "react";
import { Platform, PLATFORMS } from "@/domain/entities/platform";
import { Caption, createCaption } from "@/domain/entities/caption";
import { MusicTrack, createMusicTrack } from "@/domain/entities/music";
import { EditTemplate } from "@/domain/entities/template";
import { TEMPLATES } from "@/domain/data/templates";
import { ScoredBlock } from "@/domain/entities/job";
import { StudioStep, STUDIO_STEPS } from "@/domain/entities/studio";
import { OutputFormat, OutputQuality, DEFAULT_OUTPUT_FORMAT, DEFAULT_OUTPUT_QUALITY } from "@/domain/entities/export";

export interface SceneEditState {
  captions: Caption[];
  musicTrack: MusicTrack | null;
  originalVolume: number;
  selectedTemplate: EditTemplate | null;
}

export interface StudioState {
  platform: Platform | null;
  scenes: ScoredBlock[];
  selectedSceneIndex: number | null;
  sceneEdits: Map<number, SceneEditState>;
  currentStep: StudioStep;
}

const STEPS = STUDIO_STEPS;

function createDefaultSceneEdit(): SceneEditState {
  return {
    captions: [],
    musicTrack: null,
    originalVolume: 1,
    selectedTemplate: null,
  };
}

export function useStudio() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [scenes, setScenes] = useState<ScoredBlock[]>([]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [sceneEdits, setSceneEdits] = useState<Map<number, SceneEditState>>(new Map());
  const [currentStep, setCurrentStep] = useState<StudioStep>("platform");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(DEFAULT_OUTPUT_FORMAT);
  const [outputQuality, setOutputQuality] = useState<OutputQuality>(DEFAULT_OUTPUT_QUALITY);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const canGoNext = useMemo(() => {
    if (currentStep === "platform") return platform !== null;
    if (currentStep === "scenes") return selectedSceneIndex !== null;
    return true;
  }, [currentStep, platform, selectedSceneIndex]);

  const canGoPrev = currentStepIndex > 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const getSceneEdit = useCallback(
    (index: number): SceneEditState => {
      return sceneEdits.get(index) ?? createDefaultSceneEdit();
    },
    [sceneEdits]
  );

  const updateSceneEdit = useCallback(
    (index: number, updates: Partial<SceneEditState>) => {
      setSceneEdits((prev) => {
        const next = new Map(prev);
        const existing = next.get(index) ?? createDefaultSceneEdit();
        next.set(index, { ...existing, ...updates });
        return next;
      });
    },
    []
  );

  const currentSceneEdit = useMemo(
    () => (selectedSceneIndex !== null ? getSceneEdit(selectedSceneIndex) : null),
    [selectedSceneIndex, getSceneEdit]
  );

  const goNext = useCallback(() => {
    if (canGoNext && !isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  }, [canGoNext, isLastStep, currentStepIndex]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  }, [canGoPrev, currentStepIndex]);

  const goToStep = useCallback((step: StudioStep) => {
    setCurrentStep(step);
  }, []);

  const initFromJob = useCallback((jobScenes: ScoredBlock[]) => {
    setScenes(jobScenes);
    setSelectedSceneIndex(null);
    setSceneEdits(new Map());
  }, []);

  const selectScene = useCallback(
    (index: number) => {
      setSelectedSceneIndex(index);
      setSceneEdits((prev) => {
        if (prev.has(index)) return prev;
        const next = new Map(prev);
        next.set(index, createDefaultSceneEdit());
        return next;
      });
      setCurrentStep("captions");
    },
    []
  );

  const addCaption = useCallback(
    (caption?: Partial<Caption>) => {
      if (selectedSceneIndex === null) return;
      const edit = getSceneEdit(selectedSceneIndex);
      const newCaption = createCaption({ ...caption, sceneIndex: selectedSceneIndex });
      updateSceneEdit(selectedSceneIndex, {
        captions: [...edit.captions, newCaption],
      });
    },
    [selectedSceneIndex, getSceneEdit, updateSceneEdit]
  );

  const updateCaption = useCallback(
    (id: string, updates: Partial<Caption>) => {
      if (selectedSceneIndex === null) return;
      const edit = getSceneEdit(selectedSceneIndex);
      updateSceneEdit(selectedSceneIndex, {
        captions: edit.captions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    },
    [selectedSceneIndex, getSceneEdit, updateSceneEdit]
  );

  const removeCaption = useCallback(
    (id: string) => {
      if (selectedSceneIndex === null) return;
      const edit = getSceneEdit(selectedSceneIndex);
      updateSceneEdit(selectedSceneIndex, {
        captions: edit.captions.filter((c) => c.id !== id),
      });
    },
    [selectedSceneIndex, getSceneEdit, updateSceneEdit]
  );

  const setMusic = useCallback(
    (track: MusicTrack | null) => {
      if (selectedSceneIndex === null) return;
      updateSceneEdit(selectedSceneIndex, { musicTrack: track });
    },
    [selectedSceneIndex, updateSceneEdit]
  );

  const setOriginalVolume = useCallback(
    (volume: number) => {
      if (selectedSceneIndex === null) return;
      updateSceneEdit(selectedSceneIndex, { originalVolume: volume });
    },
    [selectedSceneIndex, updateSceneEdit]
  );

  const selectTemplate = useCallback(
    (template: EditTemplate | null) => {
      if (selectedSceneIndex === null) return;
      updateSceneEdit(selectedSceneIndex, { selectedTemplate: template });
    },
    [selectedSceneIndex, updateSceneEdit]
  );

  const reset = useCallback(() => {
    setPlatform(null);
    setScenes([]);
    setSelectedSceneIndex(null);
    setSceneEdits(new Map());
    setCurrentStep("platform");
    setOutputFormat(DEFAULT_OUTPUT_FORMAT);
    setOutputQuality(DEFAULT_OUTPUT_QUALITY);
  }, []);

  return {
    platform,
    setPlatform,
    scenes,
    selectedSceneIndex,
    selectedScenes: selectedSceneIndex !== null ? [selectedSceneIndex] : [],
    currentSceneEdit,
    sceneEdits,
    captions: currentSceneEdit?.captions ?? [],
    musicTrack: currentSceneEdit?.musicTrack ?? null,
    originalVolume: currentSceneEdit?.originalVolume ?? 1,
    selectedTemplate: currentSceneEdit?.selectedTemplate ?? null,
    currentStep,
    currentStepIndex,
    steps: STEPS,
    canGoNext,
    canGoPrev,
    isFirstStep,
    isLastStep,
    goNext,
    goPrev,
    goToStep,
    initFromJob,
    selectScene,
    addCaption,
    updateCaption,
    removeCaption,
    setMusic,
    setOriginalVolume,
    selectTemplate,
    outputFormat,
    setOutputFormat,
    outputQuality,
    setOutputQuality,
    reset,
  };
}
