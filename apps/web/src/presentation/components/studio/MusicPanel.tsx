"use client";

import { useRef, useState, useEffect } from "react";
import { MusicTrack, createMusicTrack } from "@/domain/entities/music";
import { jobApi } from "@/infrastructure/api/job-api.client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Upload, Trash2, Volume2, Loader2, Play, Pause } from "lucide-react";

interface MusicPanelProps {
  musicTrack: MusicTrack | null;
  originalVolume: number;
  onSetMusic: (track: MusicTrack | null) => void;
  onSetOriginalVolume: (volume: number) => void;
}

export function MusicPanel({
  musicTrack,
  originalVolume,
  onSetMusic,
  onSetOriginalVolume,
}: MusicPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await jobApi.uploadMusic(file);
      onSetMusic(
        createMusicTrack({
          id: result.id,
          name: result.name,
          url: result.url,
          duration: 0,
        })
      );
    } catch {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        onSetMusic(
          createMusicTrack({
            name: file.name,
            url,
            duration: audio.duration,
          })
        );
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    if (musicTrack?.id && musicTrack.url && !musicTrack.url.startsWith("blob:")) {
      try {
        await jobApi.deleteMusic(musicTrack.id);
      } catch {
        // ignore
      }
    }
    if (musicTrack?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(musicTrack.url);
    }
    onSetMusic(null);
  };

  const togglePlayPause = () => {
    if (!musicTrack?.url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(musicTrack.url);
      audioRef.current.volume = musicTrack.volume;
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-base font-semibold">Background Music</h2>
      </div>

      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Volume2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Original Audio</p>
              <p className="text-xs text-muted-foreground">Source video sound</p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {Math.round(originalVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={originalVolume}
            onChange={(e) => onSetOriginalVolume(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </CardContent>
      </Card>

      {musicTrack ? (
        <Card>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[200px]">{musicTrack.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {musicTrack.duration > 0
                      ? `${Math.floor(musicTrack.duration / 60)}:${Math.floor(musicTrack.duration % 60).toString().padStart(2, "0")}`
                      : "Uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Music Volume</span>
                <span className="font-mono">{Math.round(musicTrack.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicTrack.volume}
                onChange={(e) =>
                  onSetMusic({ ...musicTrack, volume: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fade In</span>
                  <span className="font-mono">{musicTrack.fadeIn}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={musicTrack.fadeIn}
                  onChange={(e) =>
                    onSetMusic({ ...musicTrack, fadeIn: Number(e.target.value) })
                  }
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fade Out</span>
                  <span className="font-mono">{musicTrack.fadeOut}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={musicTrack.fadeOut}
                  onChange={(e) =>
                    onSetMusic({ ...musicTrack, fadeOut: Number(e.target.value) })
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-2" />
              ) : (
                <Upload className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
              )}
              <p className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Click to upload music"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports MP3, WAV, OGG, M4A (max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
