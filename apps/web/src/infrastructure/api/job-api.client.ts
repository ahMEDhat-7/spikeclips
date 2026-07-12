import { JobApiPort, JobResponse, ClipResponse } from "../../domain/ports/job-api.port";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface ApiResponseError {
  message: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export class JobApiClient implements JobApiPort {
  async createJob(url: string, userId: string): Promise<JobResponse> {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ url, userId }),
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to create job" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse>(res);
  }

  async getJob(id: string): Promise<JobResponse> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to get job" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse>(res);
  }

  async getJobs(userId: string): Promise<JobResponse[]> {
    const res = await fetch(`${API_BASE}/jobs?userId=${userId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to get jobs" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse[]>(res);
  }

  async processJob(id: string): Promise<JobResponse> {
    const res = await fetch(`${API_BASE}/jobs/${id}/process`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to process job" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse>(res);
  }

  async exportClips(
    id: string,
    sceneIndices: number[]
  ): Promise<{ jobId: string; clipJobIds: string[] }> {
    const res = await fetch(`${API_BASE}/jobs/${id}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sceneIndices }),
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to export clips" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<{ jobId: string; clipJobIds: string[] }>(res);
  }

  async getClips(jobId: string): Promise<ClipResponse[]> {
    const res = await fetch(`${API_BASE}/clips/job/${jobId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to get clips" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<ClipResponse[]>(res);
  }
}

export const jobApi = new JobApiClient();
