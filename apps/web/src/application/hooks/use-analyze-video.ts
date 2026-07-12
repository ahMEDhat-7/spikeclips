"use client";

import { useState, useCallback } from "react";
import { jobApi } from "../../infrastructure/api/job-api.client";
import { Job } from "../../domain/entities/job";

export function useAnalyzeVideo(userId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (url: string) => {
    if (!userId) throw new Error("Not authenticated");
    setIsLoading(true);
    setError(null);

    try {
      const newJob = await jobApi.createJob(url, userId);
      setJob(newJob);

      const processedJob = await jobApi.processJob(newJob.id);
      setJob(processedJob);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const reset = useCallback(() => {
    setJob(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { job, isLoading, error, analyze, reset };
}
