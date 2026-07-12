"use client";

import { ClipResponse } from "@/domain/ports/job-api.port";
import { ClipCard } from "./ClipCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface ClipListProps {
  clips: ClipResponse[];
}

export function ClipList({ clips }: ClipListProps) {
  if (clips.length === 0) return null;

  const completedClips = clips.filter((c) => c.status === "completed");
  const totalSize = completedClips.reduce(
    (sum, c) => sum + (c.fileSize || 0),
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Processed Clips</CardTitle>
              <Badge variant="secondary" className="font-mono">
                {completedClips.length}/{clips.length}
              </Badge>
            </div>
            {totalSize > 0 && (
              <Badge variant="outline" className="font-mono">
                <Download className="h-3 w-3 mr-1" />
                {totalSize < 1024 * 1024
                  ? `${(totalSize / 1024).toFixed(1)} KB`
                  : `${(totalSize / (1024 * 1024)).toFixed(1)} MB`}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
