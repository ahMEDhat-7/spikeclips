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
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const setUserFromProfile = useCallback((profile: { id: string; email: string; name: string; plan: string; analysesUsed: number; analysesLimit: number; createdAt?: string }) => {
    setUser({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      plan: profile.plan,
      analysesUsed: profile.analysesUsed,
      analysesLimit: profile.analysesLimit,
      createdAt: profile.createdAt,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      if (profile) {
        setUserFromProfile(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [setUserFromProfile]);

  useEffect(() => {
    authApi
      .getProfile()
      .then((profile) => {
        if (profile) {
          setUserFromProfile(profile);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [setUserFromProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
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
    setUser({
      id: result.userId,
      email: result.email,
      name: result.name,
      plan: result.plan,
      analysesUsed: result.analysesUsed,
      analysesLimit: result.analysesLimit,
    });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    const updated = await authApi.updateProfile(data);
    setUserFromProfile(updated);
  }, [setUserFromProfile]);

  return { user, isLoading, login, register, logout, updateProfile, refreshUser };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
