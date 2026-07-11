import Link from "next/link";
import { UrlInput } from "@/presentation/components/jobs/UrlInput";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-6 md:p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Find what viewers{" "}
            <span className="text-primary">actually rewatch</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Extract the most-replayed moments from YouTube videos using real
            audience heatmap data — not AI guesses.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <UrlInput
            onSubmit={(url) =>
              (window.location.href = `/dashboard?url=${encodeURIComponent(url)}`)
            }
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
