"use client";

import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from "react";
import { authApi } from "../../infrastructure/api/auth-api.client";

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  analysesUsed: number;
  analysesLimit: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("spikeclip_token");
    if (stored) {
      setToken(stored);
      authApi
        .getProfile(stored)
        .then((profile) => {
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              plan: profile.plan,
              analysesUsed: profile.analysesUsed,
              analysesLimit: profile.analysesLimit,
            });
          } else {
            localStorage.removeItem("spikeclip_token");
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("spikeclip_token");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    localStorage.setItem("spikeclip_token", result.accessToken);
    setToken(result.accessToken);
    setUser({
      id: result.userId,
      email: result.email,
      name: result.name,
      plan: result.plan,
      analysesUsed: result.analysesUsed,
      analysesLimit: result.analysesLimit,
    });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const result = await authApi.register(email, password, name);
    localStorage.setItem("spikeclip_token", result.accessToken);
    setToken(result.accessToken);
    setUser({
      id: result.userId,
      email: result.email,
      name: result.name,
      plan: result.plan,
      analysesUsed: result.analysesUsed,
      analysesLimit: result.analysesLimit,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("spikeclip_token");
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, isLoading, login, register, logout };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
