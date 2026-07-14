"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Platform } from "@/domain/entities/platform";
import { EditTemplate } from "@/domain/entities/template";
import { Caption } from "@/domain/entities/caption";
import { MusicTrack } from "@/domain/entities/music";
import { ScoredBlock } from "@/domain/entities/job";
import { Download, Loader2, Check, Film, Music, Type, Sparkles } from "lucide-react";

interface ExportPanelProps {
  platform: Platform | null;
  scenes: ScoredBlock[];
  selectedScenes: number[];
  captions: Caption[];
  musicTrack: MusicTrack | null;
  originalVolume: number;
  selectedTemplate: EditTemplate | null;
  onExport: (config: { format: string; quality: string }) => void;
  isExporting?: boolean;
  initialFormat?: string;
  initialQuality?: string;
  onFormatChange?: (format: string) => void;
  onQualityChange?: (quality: string) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExportPanel({
  platform,
  scenes,
  selectedScenes,
  captions,
  musicTrack,
  originalVolume,
  selectedTemplate,
  onExport,
  isExporting,
  initialFormat = "mp4",
  initialQuality = "1080p",
  onFormatChange,
  onQualityChange,
}: ExportPanelProps) {
  const [quality, setQuality] = useState<"720p" | "1080p">(initialQuality as "720p" | "1080p");
  const [format, setFormat] = useState<"mp4" | "webm">(initialFormat as "mp4" | "webm");

  const handleFormatChange = (f: "mp4" | "webm") => {
    setFormat(f);
    onFormatChange?.(f);
  };

  const handleQualityChange = (q: "720p" | "1080p") => {
    setQuality(q);
    onQualityChange?.(q);
  };

  const selectedSceneData = selectedScenes.map((i) => scenes[i]).filter(Boolean);
  const totalDuration = selectedSceneData.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Export Settings</h2>
        <p className="text-sm text-muted-foreground">
          Review your configuration and export your clip.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Film className="h-3.5 w-3.5" /> Platform
            </span>
            <span className="font-medium">{platform?.name ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Aspect Ratio</span>
            <span className="font-mono">{platform?.aspectRatio ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Scenes</span>
            <span className="font-mono">{selectedScenes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Duration</span>
            <span className="font-mono">{formatTime(totalDuration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Template
            </span>
            <span className="font-medium">{selectedTemplate?.name ?? "None"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Type className="h-3.5 w-3.5" /> Captions
            </span>
            <span className="font-mono">{captions.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Music className="h-3.5 w-3.5" /> Music
            </span>
            <span className="font-medium">{musicTrack?.name ?? "None"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Output</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Format</label>
            <div className="flex gap-2">
              {(["mp4", "webm"] as const).map((f) => (
                <Button
                  key={f}
                  variant={format === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormatChange(f)}
                  className="font-mono"
                >
                  {format === f && <Check className="h-3 w-3 mr-1" />}
                  {f.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Quality</label>
            <div className="flex gap-2">
              {(["720p", "1080p"] as const).map((q) => (
                <Button
                  key={q}
                  variant={quality === q ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQualityChange(q)}
                  className="font-mono"
                >
                  {quality === q && <Check className="h-3 w-3 mr-1" />}
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white font-semibold"
        size="lg"
        onClick={() => onExport({ format, quality })}
        disabled={isExporting || selectedScenes.length === 0}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export Clip
          </>
        )}
      </Button>
    </div>
  );
}
