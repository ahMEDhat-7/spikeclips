"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/application/hooks/use-auth";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
