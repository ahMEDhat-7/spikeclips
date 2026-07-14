interface AuthApiResponse {
  userId: string;
  email: string;
  name: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
  scenesLimit: number;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
  scenesLimit: number;
  createdAt: string;
}

interface UpdateProfileResponse {
  id: string;
  email: string;
  name: string;
  plan: string;
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
  async register(email: string, password: string, name: string): Promise<AuthApiResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const error = await parseJson<{ message: string }>(res).catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<AuthApiResponse>(res);
  },

  async login(email: string, password: string): Promise<AuthApiResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await parseJson<{ message: string }>(res).catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<AuthApiResponse>(res);
  },

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

  async updateProfile(data: { name?: string; email?: string }): Promise<UpdateProfileResponse> {
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

    return parseJson<UpdateProfileResponse>(res);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await parseJson<{ message: string }>(res).catch(() => ({ message: "Password change failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }
  },
};
