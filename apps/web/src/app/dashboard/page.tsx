"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UrlInput } from "@/components/UrlInput";
import { HeatmapChart } from "@/components/HeatmapChart";
import { SceneList } from "@/components/SceneList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Job {
  id: string;
  status: string;
  videoTitle: string;
  videoThumbnail: string;
  scenes: any[];
  heatmapData: any[];
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeVideo = async (url: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId: "demo-user" }),
      });

      if (!res.ok) throw new Error("Failed to create job");

      const newJob = await res.json();
      setJob(newJob);

      const processRes = await fetch(`/api/jobs/${newJob.id}/process`, {
        method: "POST",
      });

      if (!processRes.ok) throw new Error("Failed to process heatmap");

      const processedJob = await processRes.json();
      setJob(processedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      analyzeVideo(initialUrl);
    }
  }, [initialUrl]);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <UrlInput onSubmit={analyzeVideo} isLoading={isLoading} />

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      {job && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                {job.videoThumbnail && (
                  <img
                    src={job.videoThumbnail}
                    alt={job.videoTitle}
                    className="w-32 h-18 object-cover rounded"
                  />
                )}
                <div>
                  <CardTitle>{job.videoTitle}</CardTitle>
                  <Badge variant={job.status === "completed" ? "default" : "secondary"}>
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
                  <HeatmapChart heatmap={job.heatmapData} scenes={job.scenes} />
                </CardContent>
              </Card>

              <SceneList
                scenes={job.scenes}
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
    </main>
  );
}
