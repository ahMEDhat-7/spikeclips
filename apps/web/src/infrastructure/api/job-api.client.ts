import { JobApiPort, JobResponse } from "../../domain/ports/job-api.port";

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
      body: JSON.stringify({ url, userId }),
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to create job" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse>(res);
  }

  async getJob(id: string): Promise<JobResponse> {
    const res = await fetch(`${API_BASE}/jobs/${id}`);

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to get job" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse>(res);
  }

  async getJobs(userId: string): Promise<JobResponse[]> {
    const res = await fetch(`${API_BASE}/jobs?userId=${userId}`);

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to get jobs" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<JobResponse[]>(res);
  }

  async processJob(id: string): Promise<JobResponse> {
    const res = await fetch(`${API_BASE}/jobs/${id}/process`, {
      method: "POST",
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
      body: JSON.stringify({ sceneIndices }),
    });

    if (!res.ok) {
      const error = await parseJson<ApiResponseError>(res).catch(() => ({ message: "Failed to export clips" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<{ jobId: string; clipJobIds: string[] }>(res);
  }
}

export const jobApi = new JobApiClient();
