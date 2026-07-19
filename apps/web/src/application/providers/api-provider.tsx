"use client";

import { createContext, useContext, ReactNode } from "react";
import { JobApiPort } from "@/domain/ports/job-api.port";
import { AuthApiPort } from "@/domain/ports/auth-api.port";
import { jobApi } from "@/infrastructure/api/job-api.client";
import { authApi } from "@/infrastructure/api/auth-api.client";

interface ApiContextType {
  jobApi: JobApiPort;
  authApi: AuthApiPort;
}

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  return (
    <ApiContext.Provider value={{ jobApi, authApi }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useJobApi(): JobApiPort {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useJobApi must be used within ApiProvider");
  return ctx.jobApi;
}

export function useAuthApi(): AuthApiPort {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useAuthApi must be used within ApiProvider");
  return ctx.authApi;
}
