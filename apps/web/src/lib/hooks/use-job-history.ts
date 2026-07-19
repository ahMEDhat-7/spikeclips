"use client";

import { useState, useCallback, useEffect } from "react";
import { useJobApi } from "@/application/providers/api-provider";
import { Job } from "@/domain/entities/job";
import { toastError } from "@/lib/toast";

export function useJobHistory(userId?: string) {
  const jobApi = useJobApi();
  const [jobHistory, setJobHistory] = useState<Job[]>([]);

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const jobs = await jobApi.getJobs();
      setJobHistory(jobs);
    } catch {
      toastError("Failed to load job history.");
    }
  }, [userId, jobApi]);

  useEffect(() => {
    if (userId) loadHistory();
  }, [userId, loadHistory]);

  return { jobHistory, loadHistory };
}
