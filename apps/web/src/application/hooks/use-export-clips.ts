"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { jobApi, StudioExportConfig } from "../../infrastructure/api/job-api.client";
import { ClipResponse } from "../../domain/ports/job-api.port";
import { CLIP_STATUS } from "../../domain/entities/job";
import { POLLING_INTERVAL_MS } from "@/lib/constants";

const MAX_POLL_ATTEMPTS = 120;

export function useExportClips(jobId: string | null) {
  const [clips, setClips] = useState<ClipResponse[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef(0);

  const startPolling = useCallback(
    (jid: string) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollCountRef.current = 0;

      pollingRef.current = setInterval(async () => {
        pollCountRef.current++;
        if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsExporting(false);
          setError("Export timed out. Please refresh and try again.");
          return;
        }
        try {
          const currentClips = await jobApi.getClips(jid);
          setClips(currentClips);

          const allDone = currentClips.every(
            (c) => c.status === CLIP_STATUS.COMPLETED || c.status === CLIP_STATUS.FAILED
          );
          if (allDone && currentClips.length > 0) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsExporting(false);
          }
        } catch {
          // polling error — ignore, will retry
        }
      }, POLLING_INTERVAL_MS);
    },
    []
  );

  const exportClips = useCallback(
    async (
      scenes: Array<{ start_time: number; end_time: number; peak_intensity?: number }>,
      studioConfig?: StudioExportConfig
    ) => {
      if (!jobId) return;
      setIsExporting(true);
      setError(null);

      try {
        const result = await jobApi.exportClips(jobId, scenes, studioConfig);
        setClips(
          result.clipJobIds.map((id, i) => ({
            id,
            jobId: result.jobId,
            sceneIndex: i,
            startTime: scenes[i]?.start_time ?? 0,
            endTime: scenes[i]?.end_time ?? 0,
            status: CLIP_STATUS.PENDING,
            createdAt: new Date().toISOString(),
          }))
        );
        startPolling(jobId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Export failed";
        setError(message);
        setIsExporting(false);
      }
    },
    [jobId, startPolling]
  );

  const loadClips = useCallback(async () => {
    if (!jobId) return;
    try {
      const currentClips = await jobApi.getClips(jobId);
      setClips(currentClips);
      if (currentClips.some((c) => c.status === CLIP_STATUS.PENDING || c.status === CLIP_STATUS.PROCESSING)) {
        setIsExporting(true);
        startPolling(jobId);
      }
    } catch {
      setError("Failed to load existing clips.");
    }
  }, [jobId, startPolling]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return {
    clips,
    isExporting,
    error,
    exportClips,
    loadClips,
  };
}
