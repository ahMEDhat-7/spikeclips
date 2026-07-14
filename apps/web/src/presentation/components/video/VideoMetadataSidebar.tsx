"use client";

import { Job } from "@/domain/entities/job";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, Film, BarChart3, Clock, User } from "lucide-react";

interface VideoMetadataSidebarProps {
  job: Job;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(yyyyMMdd: string): string {
  if (yyyyMMdd.length !== 8) return yyyyMMdd;
  const year = yyyyMMdd.slice(0, 4);
  const month = yyyyMMdd.slice(4, 6);
  const day = yyyyMMdd.slice(6, 8);
  return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoMetadataSidebar({ job }: VideoMetadataSidebarProps) {
  const scenes = job.scenes ?? [];
  const peakIntensity = scenes.length > 0 ? Math.max(...scenes.map((s) => s.peak_intensity)) : 0;
  const avgIntensity = scenes.length > 0 ? scenes.reduce((sum, s) => sum + s.avg_intensity, 0) / scenes.length : 0;
  const totalSceneDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-4">
      {job.videoThumbnail && (
        <img
          src={job.videoThumbnail}
          alt={job.videoTitle ?? "Video thumbnail"}
          className="w-full aspect-video object-cover rounded-lg"
        />
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {job.videoTitle}
          </h3>

          {job.videoChannelName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{job.videoChannelName}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            {job.videoViewCount != null && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(job.videoViewCount)} views</span>
              </div>
            )}

            {job.videoUploadDate && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(job.videoUploadDate)}</span>
              </div>
            )}

            {job.videoDuration != null && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(job.videoDuration)}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Film className="h-3 w-3" />
              <span>{scenes.length} scenes</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            Analyzed {new Date(job.createdAt).toLocaleDateString()}
          </Badge>
        </CardContent>
      </Card>

      {scenes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3" />
              Heatmap Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak intensity</span>
              <span className="font-mono">{(peakIntensity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg intensity</span>
              <span className="font-mono">{(avgIntensity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scene coverage</span>
              <span className="font-mono">
                {job.videoDuration ? `${((totalSceneDuration / job.videoDuration) * 100).toFixed(0)}%` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total scene time</span>
              <span className="font-mono">{totalSceneDuration.toFixed(1)}s</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
