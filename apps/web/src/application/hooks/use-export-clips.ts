"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { jobApi } from "../../infrastructure/api/job-api.client";
import { ClipResponse } from "../../domain/ports/job-api.port";

export function useExportClips(jobId: string | null) {
  const [clips, setClips] = useState<ClipResponse[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const exportClips = useCallback(
    async (sceneIndices: number[]) => {
      if (!jobId) return;
      setIsExporting(true);
      setError(null);

      try {
        const result = await jobApi.exportClips(jobId, sceneIndices);
        setClips(
          result.clipJobIds.map((id) => ({
            id,
            jobId: result.jobId,
            sceneIndex: sceneIndices[result.clipJobIds.indexOf(id)],
            startTime: 0,
            endTime: 0,
            status: "pending" as const,
            createdAt: new Date().toISOString(),
          }))
        );
        startPolling(jobId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Export failed";
        setError(message);
      } finally {
        setIsExporting(false);
      }
    },
    [jobId]
  );

  const startPolling = useCallback(
    (jid: string) => {
      if (pollingRef.current) clearInterval(pollingRef.current);

      pollingRef.current = setInterval(async () => {
        try {
          const currentClips = await jobApi.getClips(jid);
          setClips(currentClips);

          const allDone = currentClips.every(
            (c) => c.status === "completed" || c.status === "failed"
          );
          if (allDone && currentClips.length > 0) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        } catch {
          // polling error — ignore, will retry
        }
      }, 2000);
    },
    []
  );

  const loadClips = useCallback(async () => {
    if (!jobId) return;
    try {
      const currentClips = await jobApi.getClips(jobId);
      setClips(currentClips);
      if (currentClips.some((c) => c.status === "pending" || c.status === "processing")) {
        startPolling(jobId);
      }
    } catch {
      // ignore
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
