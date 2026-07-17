"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/application/hooks/use-auth";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const callbackUrl = rawCallbackUrl.startsWith("/") && !rawCallbackUrl.includes("://")
    ? rawCallbackUrl
    : "/dashboard";
  const { user, isLoading: authLoading } = useAuth();
  const [redirectError, setRedirectError] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push(callbackUrl);
    }
  }, [user, authLoading, router, callbackUrl]);

  useEffect(() => {
    if (!authLoading && !user) {
      const timeout = setTimeout(() => {
        window.location.href = "/api/auth/google";
      }, 500);

      const errorHandler = () => setRedirectError(true);
      window.addEventListener("error", errorHandler);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("error", errorHandler);
      };
    }
  }, [authLoading, user]);

  if (authLoading || user) {
    return (
      <main className="container mx-auto p-4 sm:p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto">
            <img src="/logo.svg" alt="SpikeClip logo" className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          {redirectError ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Unable to connect to the authentication service.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your connection and try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Redirecting you to Google to sign in...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline font-medium">
            Go back home
          </Link>
        </p>
      </div>
    </main>
  );
}
