"use client";

import { useState, useCallback, useRef } from "react";
import { jobApi } from "../../infrastructure/api/job-api.client";
import { Job } from "../../domain/entities/job";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 120;

export function useAnalyzeVideo(onComplete?: () => void) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const pollJobStatus = useCallback(
    (jobId: string, attempt: number = 0) => {
      stopPolling();

      if (attempt >= MAX_POLL_ATTEMPTS) {
        setError("Analysis timed out. Please refresh and try again.");
        setIsLoading(false);
        return;
      }

      pollingRef.current = setInterval(async () => {
        try {
          const updated = await jobApi.getJob(jobId);
          setJob(updated);

          if (updated.status === "completed" || updated.status === "failed") {
            stopPolling();
            setIsLoading(false);
            if (updated.status === "completed") {
              onComplete?.();
            }
          }
        } catch {
          stopPolling();
          setIsLoading(false);
          setError("Failed to check analysis status.");
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, onComplete]
  );

  const analyze = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      stopPolling();

      try {
        const newJob = await jobApi.createJob(url);
        setJob(newJob);

        const processedJob = await jobApi.processJob(newJob.id);
        setJob(processedJob);

        if (processedJob.status === "completed") {
          setIsLoading(false);
          onComplete?.();
        } else if (processedJob.status === "processing" || processedJob.status === "pending") {
          pollJobStatus(processedJob.id);
        } else {
          setIsLoading(false);
          if (processedJob.status === "failed") {
            setError(processedJob.errorMessage || "Analysis failed.");
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setIsLoading(false);
      }
    },
    [onComplete, pollJobStatus, stopPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setJob(null);
    setError(null);
    setIsLoading(false);
  }, [stopPolling]);

  const loadJob = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await jobApi.getJob(id);
      setJob(loaded);
      if (loaded.status === "processing" || loaded.status === "pending") {
        pollJobStatus(loaded.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load job";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [pollJobStatus]);

  return { job, isLoading, error, analyze, loadJob, reset };
}
