"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UrlInput } from "@/presentation/components/jobs/UrlInput";
import { ClipList } from "@/presentation/components/clips/ClipList";
import { ProcessingTimeline } from "@/presentation/components/features/ProcessingTimeline";
import { AnimatedStats } from "@/presentation/components/features/AnimatedStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SkeletonDashboard } from "@/components/ui/skeleton-variants";
import { useAnalyzeVideo } from "@/application/hooks/use-analyze-video";
import { useExportClips } from "@/application/hooks/use-export-clips";
import { useAuth } from "@/application/hooks/use-auth";
import { jobApi } from "@/infrastructure/api/job-api.client";
import { Job } from "@/domain/entities/job";
import { SceneEditor } from "@/presentation/components/scenes/SceneEditor";
import { VideoScenePreview } from "@/presentation/components/video/VideoScenePreview";
import { VideoMetadataSidebar } from "@/presentation/components/video/VideoMetadataSidebar";
import { History, ArrowLeft, PanelRightClose, PanelRightOpen, ExternalLink } from "lucide-react";

const analysisSteps = [
  { label: "Validate URL", description: "Checking YouTube link" },
  { label: "Extract heatmap", description: "Fetching viewer data" },
  { label: "Detect scenes", description: "Merging engagement spikes" },
  { label: "Complete", description: "Results ready" },
];

function getAnalysisStep(job: Job | null): number {
  if (!job) return 0;
  if (job.status === "failed") return 1;
  if (job.status === "completed") return 3;
  if (job.scenes && job.scenes.length > 0) return 2;
  return 1;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const { user, refreshUser } = useAuth();

  const { job, isLoading, error, analyze, loadJob } = useAnalyzeVideo(refreshUser);
  const {
    clips,
    isExporting,
    error: exportError,
    exportClips,
    loadClips,
  } = useExportClips(job?.id ?? null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | undefined>(undefined);
  const [showSidebar, setShowSidebar] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const jobs = await jobApi.getJobs();
      setJobHistory(jobs);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    if (user) loadHistory();
  }, [user, loadHistory]);

  useEffect(() => {
    if (job?.id) loadClips();
  }, [job?.id, loadClips]);

  const isProcessing = job?.status === "processing";
  const isCompleted = job?.status === "completed";
  const currentStep = getAnalysisStep(job);

  return (
    <main className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          {user && (
            <>
              {user.plan === "free" && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {user.analysesUsed}/{user.analysesLimit}
                </Badge>
              )}
              {user.plan !== "free" && (
                <Badge className="capitalize">{user.plan}</Badge>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={job ? `/studio?jobId=${job.id}` : "/studio"}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Studio
            </Button>
          </Link>
          {jobHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-4 w-4 mr-1" />
              History ({jobHistory.length})
            </Button>
          )}
        </div>
      </div>

      {showHistory && jobHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Jobs</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {jobHistory.slice(0, 10).map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                onClick={() => {
                  setShowHistory(false);
                  loadJob(j.id);
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {j.videoThumbnail && (
                    <img
                      src={j.videoThumbnail}
                      alt=""
                      className="w-16 h-9 object-cover rounded-md"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {j.videoTitle || j.url}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {new Date(j.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={j.status === "completed" ? "default" : "secondary"}
                  className="shrink-0 capitalize"
                >
                  {j.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <UrlInput onSubmit={analyze} isLoading={isLoading} />

      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4 text-destructive text-sm">
            {error}
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Processing video</h3>
              <span className="text-xs font-mono text-muted-foreground">
                Step {currentStep + 1} of {analysisSteps.length}
              </span>
            </div>
            <Progress
              value={currentStep}
              max={analysisSteps.length - 1}
              showPercentage
            />
            <ProcessingTimeline
              steps={analysisSteps}
              currentStep={currentStep}
              status={job?.status === "failed" ? "error" : "active"}
            />
          </CardContent>
        </Card>
      )}

      {job && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {job.videoThumbnail && (
                  <img
                    src={job.videoThumbnail}
                    alt={job.videoTitle}
                    className="w-full sm:w-40 h-auto sm:h-22 object-cover rounded-lg"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {job.videoTitle}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        job.status === "completed" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {job.status}
                    </Badge>
                    {job.videoDuration && (
                      <span className="text-sm font-mono text-muted-foreground">
                        {Math.floor(job.videoDuration / 60)}:
                        {(job.videoDuration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isCompleted && (
            <>
              <AnimatedStats
                videoDuration={job.videoDuration}
                sceneCount={job.scenes?.length}
                clipCount={clips.filter((c) => c.status === "completed").length}
                peakIntensity={
                  job.scenes && job.scenes.length > 0
                    ? Math.max(...job.scenes.map((s) => s.peak_intensity))
                    : undefined
                }
                totalFileSize={
                  clips
                    .filter((c) => c.fileSize)
                    .reduce((sum, c) => sum + (c.fileSize ?? 0), 0) || undefined
                }
              />

              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="flex-1 space-y-4 min-w-0">
                  <VideoScenePreview
                    job={job}
                    selectedSceneIndex={selectedSceneIndex}
                    onSceneSelect={setSelectedSceneIndex}
                  />

                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Engagement Heatmap</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="lg:hidden"
                      >
                        {showSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <SceneEditor
                        heatmap={job.heatmapData ?? []}
                        suggestedScenes={job.scenes ?? []}
                        scenesLimit={user?.scenesLimit ?? 3}
                        onExport={(scenes) => exportClips(scenes)}
                        isExporting={isExporting}
                        onSceneSelect={setSelectedSceneIndex}
                      />
                    </CardContent>
                  </Card>

                  {exportError && (
                    <Card className="border-destructive bg-destructive/5">
                      <CardContent className="p-4 text-destructive text-sm">
                        {exportError}
                      </CardContent>
                    </Card>
                  )}

                  <ClipList clips={clips} />
                </div>

                <div className={`w-full lg:w-72 shrink-0 ${showSidebar ? "" : "hidden lg:block"}`}>
                  <VideoMetadataSidebar job={job} />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!job && !isLoading && (
        <div className="text-center py-16 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
            <img
              src="/logo.svg"
              alt=""
              className="h-8 w-8 opacity-40"
            />
          </div>
          <p className="text-muted-foreground">
            Enter a YouTube URL above to get started
          </p>
          <p className="text-xs text-muted-foreground/60">
            Free tier includes 3 analyses per month
          </p>
        </div>
      )}
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<SkeletonDashboard className="container mx-auto p-4 sm:p-6" />}>
      <DashboardContent />
    </Suspense>
  );
}
