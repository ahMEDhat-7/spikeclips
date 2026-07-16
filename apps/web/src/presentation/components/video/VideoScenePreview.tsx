"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Job } from "@/domain/entities/job";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { formatTime } from "@/lib/format";
import { extractVideoId } from "@/lib/youtube";
import { VIDEO_UPDATE_INTERVAL_MS } from "@/lib/constants";

interface VideoScenePreviewProps {
  job: Job;
  selectedSceneIndex?: number;
  onSceneSelect?: (index: number) => void;
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
    height: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      origin: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  };

  const handleReady = useCallback((event: { target: { getDuration: () => number } }) => {
    setDuration(event.target.getDuration());
  }, []);

  const handleStateChange = useCallback(
    (event: { data: number }) => {
      const state = event.data;
      if (state === 1) {
        setIsPlaying(true);
        if (timeUpdateRef.current) clearInterval(timeUpdateRef.current);
        timeUpdateRef.current = setInterval(() => {
          const player = playerRef.current?.getInternalPlayer?.();
          if (player) {
            try {
              setCurrentTime(player.getCurrentTime());
            } catch {
              // player not ready
            }
          }
        }, VIDEO_UPDATE_INTERVAL_MS);
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
    <div className="overflow-hidden rounded-lg border bg-black flex flex-col">
      <div className="relative aspect-video w-full">
        <YouTube
          ref={playerRef}
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
          className="absolute inset-0 w-full h-full"
        />

        {selectedSceneIndex != null && scenes[selectedSceneIndex] && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded z-10">
            S{selectedSceneIndex + 1}: {formatTime(scenes[selectedSceneIndex].start_time)} — {formatTime(scenes[selectedSceneIndex].end_time)}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2 py-1 bg-background border-t">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevScene}
            disabled={selectedSceneIndex == null || selectedSceneIndex === 0}
            className="h-7 w-7 p-0"
          >
            <SkipBack className="h-3 w-3" />
          </Button>

          <Button variant="ghost" size="sm" onClick={togglePlay} className="h-7 w-7 p-0" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextScene}
            disabled={selectedSceneIndex == null || selectedSceneIndex >= scenes.length - 1}
            className="h-7 w-7 p-0"
          >
            <SkipForward className="h-3 w-3" />
          </Button>
        </div>

        <span className="text-[10px] font-mono text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration || job.videoDuration || 0)}
        </span>
      </div>
    </div>
  );
}
