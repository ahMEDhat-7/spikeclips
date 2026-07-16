import { PlanTier } from "@spikeclips/shared";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  plan: PlanTier;
  analysesUsed: number;
  analysesLimit: number;
  scenesLimit: number;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export const authApi = {
  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async getProfile(): Promise<UserResponse | null> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) return null;
    return parseJson<UserResponse>(res);
  },

  async updateProfile(data: { name?: string }): Promise<UserResponse> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await parseJson<{ message: string }>(res).catch(() => ({ message: "Update failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<UserResponse>(res);
  },
};
