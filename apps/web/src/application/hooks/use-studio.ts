"use client";

import { useState, useCallback, useMemo } from "react";
import { Platform, PLATFORMS } from "@/domain/entities/platform";
import { Caption, createCaption } from "@/domain/entities/caption";
import { MusicTrack, createMusicTrack } from "@/domain/entities/music";
import { EditTemplate } from "@/domain/entities/template";
import { TEMPLATES } from "@/domain/data/templates";
import { ScoredBlock } from "@/domain/entities/job";

export type StudioStep = "platform" | "scenes" | "captions" | "music" | "templates" | "export";

export interface StudioState {
  platform: Platform | null;
  scenes: ScoredBlock[];
  selectedScenes: number[];
  captions: Caption[];
  musicTrack: MusicTrack | null;
  originalVolume: number;
  selectedTemplate: EditTemplate | null;
  currentStep: StudioStep;
}

const STEPS: StudioStep[] = ["platform", "scenes", "captions", "music", "templates", "export"];

export function useStudio() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [scenes, setScenes] = useState<ScoredBlock[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<number[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [musicTrack, setMusicTrack] = useState<MusicTrack | null>(null);
  const [originalVolume, setOriginalVolume] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<EditTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState<StudioStep>("platform");
  const [outputFormat, setOutputFormat] = useState<string>("mp4");
  const [outputQuality, setOutputQuality] = useState<string>("1080p");

  const currentStepIndex = STEPS.indexOf(currentStep);
  const canGoNext = useMemo(() => {
    if (currentStep === "platform") return platform !== null;
    if (currentStep === "scenes") return selectedScenes.length > 0;
    return true;
  }, [currentStep, platform, selectedScenes]);

  const canGoPrev = currentStepIndex > 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

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
    setSelectedScenes(jobScenes.map((_, i) => i));
  }, []);

  const toggleSceneSelection = useCallback((index: number) => {
    setSelectedScenes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort()
    );
  }, []);

  const selectAllScenes = useCallback(() => {
    setSelectedScenes(scenes.map((_, i) => i));
  }, [scenes]);

  const deselectAllScenes = useCallback(() => {
    setSelectedScenes([]);
  }, []);

  const addCaption = useCallback((caption?: Partial<Caption>) => {
    setCaptions((prev) => [...prev, createCaption(caption)]);
  }, []);

  const updateCaption = useCallback((id: string, updates: Partial<Caption>) => {
    setCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const removeCaption = useCallback((id: string) => {
    setCaptions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setMusic = useCallback((track: MusicTrack | null) => {
    setMusicTrack(track);
  }, []);

  const selectTemplate = useCallback((template: EditTemplate | null) => {
    setSelectedTemplate(template);
  }, []);

  const reset = useCallback(() => {
    setPlatform(null);
    setScenes([]);
    setSelectedScenes([]);
    setCaptions([]);
    setMusicTrack(null);
    setOriginalVolume(1);
    setSelectedTemplate(null);
    setCurrentStep("platform");
    setOutputFormat("mp4");
    setOutputQuality("1080p");
  }, []);

  return {
    platform,
    setPlatform,
    scenes,
    selectedScenes,
    captions,
    musicTrack,
    originalVolume,
    selectedTemplate,
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
    toggleSceneSelection,
    selectAllScenes,
    deselectAllScenes,
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
