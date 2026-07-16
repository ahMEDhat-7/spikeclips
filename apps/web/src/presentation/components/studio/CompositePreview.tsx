"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import YouTube from "react-youtube";
import { Job } from "@/domain/entities/job";
import { Platform } from "@/domain/entities/platform";
import { Caption } from "@/domain/entities/caption";
import { EditTemplate } from "@/domain/entities/template";
import { MusicTrack } from "@/domain/entities/music";
import type { ScoredBlock } from "@spikeclips/shared";
import { CaptionOverlay } from "./CaptionOverlay";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import { formatTime } from "@/lib/format";
import { extractVideoId } from "@/lib/youtube";
import { FPS, VIDEO_UPDATE_INTERVAL_MS } from "@/lib/constants";

interface CompositePreviewProps {
  job: Job;
  platform: Platform | null;
  captions: Caption[];
  selectedTemplate: EditTemplate | null;
  scenes: ScoredBlock[];
  selectedScenes: number[];
  musicTrack: MusicTrack | null;
}

export function CompositePreview({
  job,
  platform,
  captions,
  selectedTemplate,
  scenes,
  selectedScenes,
  musicTrack,
}: CompositePreviewProps) {
  const playerRef = useRef<YouTube | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 300, height: 533 });
  const timeUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoId = extractVideoId(job.url);

  const orderedScenes = useMemo(
    () => selectedScenes.map((i) => scenes[i]).filter(Boolean),
    [selectedScenes, scenes]
  );

  const totalDuration = useMemo(
    () => orderedScenes.reduce((sum, s) => sum + s.duration, 0),
    [orderedScenes]
  );

  const activeScene = orderedScenes[currentSceneIdx] ?? null;

  const sceneElapsed = useMemo(() => {
    if (!activeScene) return 0;
    return Math.max(0, currentTime - activeScene.start_time);
  }, [currentTime, activeScene]);

  const activeCaptions = useMemo(() => {
    if (!activeScene) return [];
    const fps = FPS;
    return captions.filter((c) => {
      if (c.sceneIndex !== undefined && c.sceneIndex !== currentSceneIdx) return false;
      const captionStart = c.startFrame / fps;
      const captionEnd = c.endFrame / fps;
      return sceneElapsed >= captionStart && sceneElapsed <= captionEnd;
    });
  }, [captions, sceneElapsed, currentSceneIdx, activeScene]);

  // Measure container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Music audio sync — create audio once, update volume via ref
  useEffect(() => {
    if (!musicTrack?.url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    if (!audioRef.current || audioRef.current.src !== musicTrack.url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(musicTrack.url);
    }

    const audio = audioRef.current;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [musicTrack?.url, isPlaying]);

  // Update music volume separately — no dependency on currentTime
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicTrack) return;

    let volume = musicTrack.volume;

    if (activeScene) {
      const sceneDur = activeScene.end_time - activeScene.start_time;
      const elapsed = currentTime - activeScene.start_time;

      if (musicTrack.fadeIn > 0 && elapsed < musicTrack.fadeIn) {
        volume = musicTrack.volume * (elapsed / musicTrack.fadeIn);
      }
      if (musicTrack.fadeOut > 0 && elapsed > sceneDur - musicTrack.fadeOut) {
        volume = musicTrack.volume * ((sceneDur - elapsed) / musicTrack.fadeOut);
      }
    }

    audio.volume = Math.max(0, Math.min(1, volume));
  }, [currentTime, musicTrack, activeScene]);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        controls: 0,
        disablekb: 1,
        origin: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    }),
    []
  );

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

  const playScene = useCallback(
    (index: number) => {
      const scene = orderedScenes[index];
      if (scene) {
        setCurrentSceneIdx(index);
        seekTo(scene.start_time);
        const player = playerRef.current?.getInternalPlayer?.();
        if (player) {
          try {
            player.playVideo();
          } catch {
            // not ready
          }
        }
      }
    },
    [orderedScenes, seekTo]
  );

  const togglePlay = useCallback(() => {
    const player = playerRef.current?.getInternalPlayer?.();
    if (!player) return;
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        if (activeScene && currentTime < activeScene.start_time) {
          seekTo(activeScene.start_time);
        }
        player.playVideo();
      }
    } catch {
      // not ready
    }
  }, [isPlaying, activeScene, currentTime, seekTo]);

  const prevScene = useCallback(() => {
    if (currentSceneIdx > 0) {
      playScene(currentSceneIdx - 1);
    }
  }, [currentSceneIdx, playScene]);

  const nextScene = useCallback(() => {
    if (currentSceneIdx < orderedScenes.length - 1) {
      playScene(currentSceneIdx + 1);
    }
  }, [currentSceneIdx, orderedScenes.length, playScene]);

  const handleReady = useCallback(() => {}, []);

  const handleStateChange = useCallback((event: { data: number }) => {
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
            // not ready
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
  }, []);

  useEffect(() => {
    return () => {
      if (timeUpdateRef.current) clearInterval(timeUpdateRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevScene();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextScene();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, prevScene, nextScene]);

  useEffect(() => {
    if (!isPlaying || !activeScene) return;
    if (currentTime >= activeScene.end_time) {
      if (currentSceneIdx < orderedScenes.length - 1) {
        playScene(currentSceneIdx + 1);
      } else {
        const player = playerRef.current?.getInternalPlayer?.();
        if (player) {
          try {
            player.pauseVideo();
          } catch {
            // ignore
          }
        }
        setCurrentSceneIdx(0);
        setIsPlaying(false);
      }
    }
  }, [currentTime, isPlaying, activeScene, currentSceneIdx, orderedScenes.length, playScene]);

  const exceedsMax = platform && totalDuration > platform.maxDuration;

  const layout = selectedTemplate?.config?.layout ?? "full";

  const layoutOverlay = useMemo(() => {
    switch (layout) {
      case "split-horizontal":
        return (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
          </div>
        );
      case "split-vertical":
        return (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
          </div>
        );
      case "grid":
        return (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
          </div>
        );
      default:
        return null;
    }
  }, [layout]);

  const hasVignette = selectedTemplate?.config?.overlayEffects?.includes("vignette");
  const hasPovLabel = selectedTemplate?.category === "pov";

  if (!videoId) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground">Preview</span>
        {platform && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            {platform.name}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-3 min-h-0">
        <div className="relative w-full max-w-full">
          <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-lg border bg-black ${platform ? "aspect-[9/16]" : "aspect-video"}`}
          >
            <YouTube
              ref={playerRef}
              videoId={videoId}
              opts={opts}
              onReady={handleReady}
              onStateChange={handleStateChange}
              className="absolute inset-0 w-full h-full"
            />

            {!platform && (
              <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute left-0 right-0 top-[12.5%] h-[75%] border-2 border-primary/40 rounded" />
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-black/30" />
                <div className="absolute left-0 right-0 top-[12.5%] h-[75%] bg-transparent" />
              </div>
            )}

            {layoutOverlay}

            {activeCaptions.map((caption) => (
              <CaptionOverlay
                key={caption.id}
                caption={caption}
                sceneElapsed={sceneElapsed}
                containerWidth={containerSize.width}
                containerHeight={containerSize.height}
              />
            ))}

            {hasPovLabel && (
              <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
                <span
                  className="inline-block px-3 py-1 bg-black/60 rounded text-white text-xs font-bold uppercase tracking-wider"
                >
                  POV:
                </span>
              </div>
            )}

            {hasVignette && (
              <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
                }}
              />
            )}

            {activeScene && (
              <div className="absolute top-1.5 left-1.5 right-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded z-10">
                S{currentSceneIdx + 1}: {formatTime(activeScene.start_time)} — {formatTime(activeScene.end_time)}
              </div>
            )}

            {musicTrack && (
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5 z-10">
                <Music className="h-2.5 w-2.5 text-primary" />
                <span className="text-[8px] text-white/80 font-mono truncate max-w-[80px]">
                  {musicTrack.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevScene}
            disabled={currentSceneIdx === 0}
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
            disabled={currentSceneIdx >= orderedScenes.length - 1}
            className="h-7 w-7 p-0"
          >
            <SkipForward className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] w-full max-w-full">
          <span className="text-muted-foreground">
            {currentSceneIdx + 1}/{orderedScenes.length} scenes
          </span>
          <span className={exceedsMax ? "text-destructive font-medium" : "text-muted-foreground"}>
            {formatTime(totalDuration)}
            {platform && ` / ${formatTime(platform.maxDuration)}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 justify-center max-w-full">
          {orderedScenes.map((s, i) => (
            <button
              key={i}
              onClick={() => playScene(i)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${
                i === currentSceneIdx
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {formatTime(s.start_time)} — {formatTime(s.end_time)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
