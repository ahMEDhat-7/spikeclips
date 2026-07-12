interface AuthApiResponse {
  accessToken: string;
  userId: string;
  email: string;
  name: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
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
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await parseJson<{ message: string }>(res).catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return parseJson<AuthApiResponse>(res);
  },

  async getProfile(token: string): Promise<UserResponse | null> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    return parseJson<UserResponse>(res);
  },
};
