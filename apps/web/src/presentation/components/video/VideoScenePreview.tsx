"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Job, ScoredBlock } from "@/domain/entities/job";
import { SceneTimelineBar } from "./SceneTimelineBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface VideoScenePreviewProps {
  job: Job;
  selectedSceneIndex?: number;
  onSceneSelect?: (index: number) => void;
}

function extractVideoId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoScenePreview({
  job,
  selectedSceneIndex,
  onSceneSelect,
}: VideoScenePreviewProps) {
  const playerRef = useRef<YouTube | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const timeUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoId = extractVideoId(job.url);
  const scenes = job.scenes ?? [];

  const opts = {
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
    },
  };

  const handleReady = useCallback((event: { target: { getDuration: () => number } }) => {
    setDuration(event.target.getDuration());
  }, []);

  const handleStateChange = useCallback(
    (event: { data: number }) => {
      const state = event.data;
      // 1 = playing, 2 = paused, 0 = ended
      if (state === 1) {
        setIsPlaying(true);
        timeUpdateRef.current = setInterval(() => {
          const player = playerRef.current?.getInternalPlayer?.();
          if (player) {
            try {
              setCurrentTime(player.getCurrentTime());
            } catch {
              // player not ready
            }
          }
        }, 250);
      } else {
        setIsPlaying(false);
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
          timeUpdateRef.current = null;
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timeUpdateRef.current) clearInterval(timeUpdateRef.current);
    };
  }, []);

  const seekTo = useCallback((time: number) => {
    const player = playerRef.current?.getInternalPlayer?.();
    if (player) {
      try {
        player.seekTo(time, true);
        setCurrentTime(time);
      } catch {
        // player not ready
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current?.getInternalPlayer?.();
    if (!player) return;
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch {
      // player not ready
    }
  }, [isPlaying]);

  const seekToScene = useCallback(
    (index: number) => {
      const scene = scenes[index];
      if (scene) {
        seekTo(scene.start_time);
        onSceneSelect?.(index);
      }
    },
    [scenes, seekTo, onSceneSelect]
  );

  const prevScene = useCallback(() => {
    if (selectedSceneIndex != null && selectedSceneIndex > 0) {
      seekToScene(selectedSceneIndex - 1);
    }
  }, [selectedSceneIndex, seekToScene]);

  const nextScene = useCallback(() => {
    if (selectedSceneIndex != null && selectedSceneIndex < scenes.length - 1) {
      seekToScene(selectedSceneIndex + 1);
    }
  }, [selectedSceneIndex, scenes.length, seekToScene]);

  if (!videoId) return null;

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <div className="relative">
          <YouTube
            ref={playerRef}
            videoId={videoId}
            opts={opts}
            onReady={handleReady}
            onStateChange={handleStateChange}
            className="w-full aspect-video"
          />

          {selectedSceneIndex != null && scenes[selectedSceneIndex] && (
            <div className="absolute top-3 left-3 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded">
              Scene {selectedSceneIndex + 1}: {formatTime(scenes[selectedSceneIndex].start_time)} — {formatTime(scenes[selectedSceneIndex].end_time)}
            </div>
          )}
        </div>

        {scenes.length > 0 && (
          <div className="px-3 py-2 border-t">
            <SceneTimelineBar
              duration={duration || job.videoDuration || 0}
              scenes={scenes}
              currentTime={currentTime}
              selectedSceneIndex={selectedSceneIndex}
              onSceneClick={seekToScene}
            />
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-2 border-t">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevScene}
              disabled={selectedSceneIndex == null || selectedSceneIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextScene}
              disabled={selectedSceneIndex == null || selectedSceneIndex >= scenes.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration || job.videoDuration || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
