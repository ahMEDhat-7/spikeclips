"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UrlInput } from "@/presentation/components/jobs/UrlInput";
import { HeatmapChart } from "@/presentation/components/heatmap/HeatmapChart";
import { SceneList } from "@/presentation/components/scenes/SceneList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyzeVideo } from "@/application/hooks/use-analyze-video";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const { job, isLoading, error, analyze } = useAnalyzeVideo();

  return (
    <main className="container mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

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
                  <Badge
                    variant={
                      job.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {job.status}
                  </Badge>
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
                onExport={(selected) => {
                  console.log("Exporting:", selected);
                }}
              />
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
