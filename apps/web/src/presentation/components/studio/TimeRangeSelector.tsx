"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Plus } from "lucide-react";
import { formatTime } from "@/lib/format";
import { MIN_SCENE_DURATION, MAX_SCENE_DURATION } from "@/lib/constants";

interface TimeRangeSelectorProps {
  videoDuration: number;
  onApply: (start: number, end: number) => void;
}

export function TimeRangeSelector({ videoDuration, onApply }: TimeRangeSelectorProps) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Math.min(30, videoDuration));
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const minRange = MIN_SCENE_DURATION;
  const maxRange = MAX_SCENE_DURATION;

  const timeToPercent = (time: number) => (videoDuration > 0 ? (time / videoDuration) * 100 : 0);
  const percentToTime = (pct: number) => Math.max(0, Math.min(videoDuration, (pct / 100) * videoDuration));

  const handlePointerDown = useCallback(
    (handle: "start" | "end") => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      setDragging(handle);

      const bar = barRef.current;
      if (!bar) return;
      const barRect = bar.getBoundingClientRect();

      const onMove = (ev: PointerEvent) => {
        const pct = ((ev.clientX - barRect.left) / barRect.width) * 100;
        const time = percentToTime(Math.max(0, Math.min(100, pct)));

        if (handle === "start") {
          const newStart = Math.min(time, end - minRange);
          setStart(Math.max(0, newStart));
        } else {
          const newEnd = Math.max(time, start + minRange);
          setEnd(Math.min(videoDuration, newEnd));
        }
      };

      const onUp = () => {
        setDragging(null);
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    },
    [start, end, videoDuration]
  );

  const handleStartInput = (val: string) => {
    const t = Math.max(0, parseFloat(val) || 0);
    setStart(Math.min(t, end - minRange));
  };

  const handleEndInput = (val: string) => {
    const t = Math.max(0, parseFloat(val) || 0);
    setEnd(Math.min(videoDuration, Math.max(t, start + minRange)));
  };

  const range = end - start;
  const isValid = range >= minRange && range <= maxRange && start >= 0 && end <= videoDuration;

  const handleApply = () => {
    if (isValid) {
      onApply(start, end);
      setStart(0);
      setEnd(Math.min(30, videoDuration));
    }
  };

  const startPct = timeToPercent(start);
  const endPct = timeToPercent(end);

  return (
    <Card className="border-dashed">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Scissors className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <h3 className="text-xs font-medium">Custom Time Range</h3>
            <p className="text-[10px] text-muted-foreground">
              Drag handles to select a segment, or enter times below
            </p>
          </div>
        </div>

        <div className="relative" ref={barRef}>
          <div className="h-6 bg-muted rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-primary/20"
              style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-3 -ml-1.5 cursor-ew-resize z-10 group"
            style={{ left: `${startPct}%` }}
            onPointerDown={handlePointerDown("start")}
          >
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 rounded-full transition-colors ${
              dragging === "start" ? "bg-primary" : "bg-primary/60 group-hover:bg-primary"
            }`} />
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {formatTime(start)}
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-3 -ml-1.5 cursor-ew-resize z-10 group"
            style={{ left: `${endPct}%` }}
            onPointerDown={handlePointerDown("end")}
          >
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 rounded-full transition-colors ${
              dragging === "end" ? "bg-primary" : "bg-primary/60 group-hover:bg-primary"
            }`} />
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {formatTime(end)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <span className="text-[10px] text-muted-foreground">Start (s)</span>
            <Input
              type="number"
              min={0}
              max={videoDuration}
              step={0.1}
              value={start.toFixed(1)}
              onChange={(e) => handleStartInput(e.target.value)}
              className="text-xs font-mono h-7"
            />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">End (s)</span>
            <Input
              type="number"
              min={0}
              max={videoDuration}
              step={0.1}
              value={end.toFixed(1)}
              onChange={(e) => handleEndInput(e.target.value)}
              className="text-xs font-mono h-7"
            />
          </div>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!isValid}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Apply
          </Button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Duration: {range.toFixed(1)}s</span>
          {!isValid && range < minRange && (
            <span className="text-destructive">Min {minRange}s</span>
          )}
          {!isValid && range > maxRange && (
            <span className="text-destructive">Max {maxRange}s</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
