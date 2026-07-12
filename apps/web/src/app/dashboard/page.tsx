"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { UrlInput } from "@/presentation/components/jobs/UrlInput";
import { HeatmapChart } from "@/presentation/components/heatmap/HeatmapChart";
import { SceneList } from "@/presentation/components/scenes/SceneList";
import { ClipList } from "@/presentation/components/clips/ClipList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyzeVideo } from "@/application/hooks/use-analyze-video";
import { useExportClips } from "@/application/hooks/use-export-clips";
import { useAuth } from "@/application/hooks/use-auth";
import { jobApi } from "@/infrastructure/api/job-api.client";
import { Job } from "@/domain/entities/job";
import { Loader2, History } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";
  const { user } = useAuth();

  const { job, isLoading, error, analyze } = useAnalyzeVideo();
  const { clips, isExporting, error: exportError, exportClips, loadClips } = useExportClips(job?.id ?? null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const jobs = await jobApi.getJobs(user.id);
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

  return (
    <main className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        {user && (
          <div className="flex items-center gap-3">
            {user.plan === "free" && (
              <Badge variant="secondary">
                {user.analysesUsed}/{user.analysesLimit} analyses used
              </Badge>
            )}
            {user.plan !== "free" && (
              <Badge>{user.plan}</Badge>
            )}
            {jobHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4 mr-1" />
                History ({jobHistory.length})
              </Button>
            )}
          </div>
        )}
      </div>

      {showHistory && jobHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {jobHistory.slice(0, 10).map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  // Could navigate to job detail in future
                  setShowHistory(false);
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {j.videoThumbnail && (
                    <img
                      src={j.videoThumbnail}
                      alt=""
                      className="w-12 h-8 object-cover rounded"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{j.videoTitle || j.url}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(j.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={j.status === "completed" ? "default" : "secondary"} className="shrink-0">
                  {j.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <UrlInput onSubmit={analyze} isLoading={isLoading} />

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      {job && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {job.videoThumbnail && (
                  <img
                    src={job.videoThumbnail}
                    alt={job.videoTitle}
                    className="w-full sm:w-32 h-auto sm:h-18 object-cover rounded"
                  />
                )}
                <div className="space-y-1">
                  <CardTitle className="text-lg sm:text-xl">
                    {job.videoTitle}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        job.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {job.status}
                    </Badge>
                    {job.videoDuration && (
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(job.videoDuration / 60)}:{(job.videoDuration % 60).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {job.status === "completed" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeatmapChart
                    heatmap={job.heatmapData ?? []}
                    scenes={job.scenes ?? []}
                  />
                </CardContent>
              </Card>

              <SceneList
                scenes={job.scenes ?? []}
                onExport={exportClips}
                isExporting={isExporting}
              />

              {exportError && (
                <Card className="border-destructive">
                  <CardContent className="p-4 text-destructive">{exportError}</CardContent>
                </Card>
              )}

              <ClipList clips={clips} />
            </>
          )}

          {job.status === "processing" && (
            <Card>
              <CardContent className="p-8 flex items-center justify-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Analyzing video heatmap...</span>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!job && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Enter a YouTube URL above to get started.
        </div>
      )}
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto p-4 sm:p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[120px] w-full" />
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
