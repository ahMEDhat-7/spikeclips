"use client";

import { ClipResponse } from "@/domain/ports/job-api.port";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";

interface ClipCardProps {
  clip: ClipResponse;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ClipCard({ clip }: ClipCardProps) {
  const statusColors = {
    pending: "secondary",
    processing: "secondary",
    completed: "default",
    failed: "destructive",
  } as const;

  return (
    <Card className="transition-colors hover:border-muted-foreground/50 hover:bg-surface-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-medium">
                Scene {clip.sceneIndex + 1}
              </span>
              <span className="text-muted-foreground text-sm font-mono">
                {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
              </span>
              {clip.duration && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {clip.duration.toFixed(1)}s
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant={
                  statusColors[clip.status as keyof typeof statusColors] ||
                  "secondary"
                }
                className="capitalize"
              >
                {clip.status}
              </Badge>
              {clip.fileSize && (
                <span className="text-xs font-mono text-muted-foreground">
                  {formatFileSize(clip.fileSize)}
                </span>
              )}
              {clip.errorMessage && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {clip.errorMessage}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {clip.status === "processing" && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {clip.status === "completed" && clip.fileUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={clip.fileUrl} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
