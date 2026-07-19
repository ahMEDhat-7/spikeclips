"use client";

import { ClipResponse } from "@/domain/ports/job-api.port";
import { CLIP_STATUS } from "@/domain/entities/job";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { formatTime, formatFileSize } from "@/lib/format";

interface ClipCardProps {
  clip: ClipResponse;
}

export function ClipCard({ clip }: ClipCardProps) {
  const statusColors = {
    [CLIP_STATUS.PENDING]: "secondary",
    [CLIP_STATUS.PROCESSING]: "secondary",
    [CLIP_STATUS.COMPLETED]: "default",
    [CLIP_STATUS.FAILED]: "destructive",
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
            {clip.status === CLIP_STATUS.PROCESSING && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {clip.status === CLIP_STATUS.COMPLETED && clip.fileUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={`/api/clips/${clip.id}/download`} download rel="noopener noreferrer">
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
