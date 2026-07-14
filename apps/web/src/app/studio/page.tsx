"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStudio } from "@/application/hooks/use-studio";
import { useExportClips } from "@/application/hooks/use-export-clips";
import { jobApi } from "@/infrastructure/api/job-api.client";
import { Job } from "@/domain/entities/job";
import { StudioLayout } from "@/presentation/components/studio/StudioLayout";
import { StudioToolbar } from "@/presentation/components/studio/StudioToolbar";
import { ToolPalette } from "@/presentation/components/studio/ToolPalette";
import { StudioTimeline } from "@/presentation/components/studio/StudioTimeline";
import { PlatformSelector } from "@/presentation/components/studio/PlatformSelector";
import { SceneSelector } from "@/presentation/components/studio/SceneSelector";
import { CaptionEditor } from "@/presentation/components/studio/CaptionEditor";
import { MusicPanel } from "@/presentation/components/studio/MusicPanel";
import { TemplateLibrary } from "@/presentation/components/studio/TemplateLibrary";
import { ExportPanel } from "@/presentation/components/studio/ExportPanel";
import { VideoScenePreview } from "@/presentation/components/video/VideoScenePreview";
import { VideoMetadataSidebar } from "@/presentation/components/video/VideoMetadataSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdFromUrl = searchParams.get("jobId");
  const studio = useStudio();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | undefined>(undefined);

  const { clips, isExporting, exportClips } = useExportClips(job?.id ?? null);

  const loadJob = useCallback(async (id: string) => {
    setIsLoadingJob(true);
    try {
      const loaded = await jobApi.getJob(id);
      setJob(loaded);
      studio.initFromJob(loaded.scenes ?? []);
      studio.goToStep("scenes");
    } catch {
      // ignore
    } finally {
      setIsLoadingJob(false);
    }
  }, [studio.initFromJob, studio.goToStep]);

  useEffect(() => {
    if (jobIdFromUrl && !job) {
      loadJob(jobIdFromUrl);
    }
  }, [jobIdFromUrl, job, loadJob]);

  const pollJob = useCallback(async (jobId: string) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const updated = await jobApi.getJob(jobId);
        if (updated.status === "completed" || updated.status === "failed") {
          setJob(updated);
          if (updated.status === "completed") {
            studio.initFromJob(updated.scenes ?? []);
            studio.goToStep("scenes");
          }
          return;
        }
      } catch {
        return;
      }
    }
  }, [studio]);

  const handleAnalyze = useCallback(async () => {
    if (!urlInput.trim()) return;
    setIsLoadingJob(true);
    try {
      const newJob = await jobApi.createJob(urlInput);
      const processed = await jobApi.processJob(newJob.id);
      setJob(processed);
      if (processed.status === "completed") {
        studio.initFromJob(processed.scenes ?? []);
        studio.goToStep("scenes");
      } else {
        pollJob(processed.id);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingJob(false);
    }
  }, [urlInput, studio, pollJob]);

  const handleExport = useCallback(
    (outputConfig?: { format: string; quality: string }) => {
      if (!job) return;
      const scenesToExport = studio.selectedScenes.map((i) => studio.scenes[i]);

      const musicConfig = studio.musicTrack
        ? {
            fileKey: studio.musicTrack.id,
            volume: studio.musicTrack.volume,
            originalVolume: studio.originalVolume,
            fadeIn: studio.musicTrack.fadeIn,
            fadeOut: studio.musicTrack.fadeOut,
          }
        : undefined;

      exportClips(
        scenesToExport.map((s) => ({
          start_time: s.start_time,
          end_time: s.end_time,
          peak_intensity: s.peak_intensity,
        })),
        {
          platform: studio.platform?.id,
          format: outputConfig?.format ?? "mp4",
          quality: outputConfig?.quality ?? "1080p",
          captions: studio.captions.length > 0 ? studio.captions : undefined,
          music: musicConfig,
          templateId: studio.selectedTemplate?.id,
          templateConfig: studio.selectedTemplate?.config as unknown as Record<string, unknown>,
        }
      );
    },
    [job, studio, exportClips]
  );

  const totalDuration = studio.scenes
    .filter((_, i) => studio.selectedScenes.includes(i))
    .reduce((sum, s) => sum + s.duration, 0);

  const renderCenter = () => {
    switch (studio.currentStep) {
      case "platform":
        if (!job) {
          return (
            <div className="max-w-xl mx-auto space-y-6 py-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Clip Studio</h1>
                <p className="text-muted-foreground">
                  Paste a YouTube URL to start creating your clip.
                </p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAnalyze();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      disabled={isLoadingJob}
                    />
                    <Button type="submit" disabled={isLoadingJob || !urlInput.trim()}>
                      {isLoadingJob ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <PlatformSelector
                selected={studio.platform}
                onSelect={studio.setPlatform}
              />
            </div>
          );
        }

        return (
          <div className="space-y-6 py-4">
            <PlatformSelector
              selected={studio.platform}
              onSelect={studio.setPlatform}
            />
          </div>
        );

      case "scenes":
        return (
          <div className="space-y-6 py-4">
            {job && (
              <VideoScenePreview
                job={job}
                selectedSceneIndex={selectedSceneIndex}
                onSceneSelect={setSelectedSceneIndex}
              />
            )}
            <SceneSelector
              scenes={studio.scenes}
              selectedScenes={studio.selectedScenes}
              onToggle={studio.toggleSceneSelection}
              onSelectAll={studio.selectAllScenes}
              onDeselectAll={studio.deselectAllScenes}
            />
          </div>
        );

      case "captions":
        return (
          <div className="py-4">
            <CaptionEditor
              captions={studio.captions}
              onAdd={studio.addCaption}
              onUpdate={studio.updateCaption}
              onRemove={studio.removeCaption}
            />
          </div>
        );

      case "music":
        return (
          <div className="py-4">
            <MusicPanel
              musicTrack={studio.musicTrack}
              originalVolume={studio.originalVolume}
              onSetMusic={studio.setMusic}
              onSetOriginalVolume={studio.setOriginalVolume}
            />
          </div>
        );

      case "templates":
        return (
          <div className="py-4">
            <TemplateLibrary
              selectedTemplate={studio.selectedTemplate}
              onSelect={studio.selectTemplate}
            />
          </div>
        );

      case "export":
        return (
          <div className="py-4">
            <ExportPanel
              platform={studio.platform}
              scenes={studio.scenes}
              selectedScenes={studio.selectedScenes}
              captions={studio.captions}
              musicTrack={studio.musicTrack}
              originalVolume={studio.originalVolume}
              selectedTemplate={studio.selectedTemplate}
              onExport={handleExport}
              isExporting={isExporting}
              initialFormat={studio.outputFormat}
              initialQuality={studio.outputQuality}
              onFormatChange={studio.setOutputFormat}
              onQualityChange={studio.setOutputQuality}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderRight = () => {
    if (!job) return null;
    if (studio.currentStep === "platform" || studio.currentStep === "export") {
      return <VideoMetadataSidebar job={job} />;
    }
    return null;
  };

  return (
    <StudioLayout
      toolbar={
        <StudioToolbar
          currentStep={studio.currentStep}
          currentStepIndex={studio.currentStepIndex}
          steps={studio.steps}
          canGoNext={studio.canGoNext}
          canGoPrev={studio.canGoPrev}
          isFirstStep={studio.isFirstStep}
          isLastStep={studio.isLastStep}
          onGoNext={studio.goNext}
          onGoPrev={studio.goPrev}
          onGoToStep={studio.goToStep}
          onExport={handleExport}
          onReset={studio.reset}
          isExporting={isExporting}
          outputFormat={studio.outputFormat}
          outputQuality={studio.outputQuality}
        />
      }
      left={
        <ToolPalette
          currentStep={studio.currentStep}
          onStepChange={studio.goToStep}
        />
      }
      center={renderCenter()}
      right={renderRight()}
      bottom={
        studio.scenes.length > 0 ? (
          <StudioTimeline
            scenes={studio.scenes}
            selectedScenes={studio.selectedScenes}
            totalDuration={job?.videoDuration ?? 0}
            onToggleScene={studio.toggleSceneSelection}
          />
        ) : undefined
      }
    />
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
