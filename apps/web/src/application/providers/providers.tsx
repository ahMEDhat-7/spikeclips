"use client";

import { ReactNode } from "react";
import { ApiProvider } from "@/application/providers/api-provider";
import { AuthProvider } from "@/application/hooks/use-auth";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApiProvider>
      <AuthProvider>{children}</AuthProvider>
    </ApiProvider>
  );
}
