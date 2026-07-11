import Link from "next/link";
import { UrlInput } from "@/components/UrlInput";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Find what viewers actually rewatch
          </h1>
          <p className="text-lg text-muted-foreground">
            Extract the most-replayed moments from YouTube videos using real
            audience heatmap data — not AI guesses.
          </p>
        </div>

        <UrlInput onSubmit={(url) => window.location.href = `/dashboard?url=${encodeURIComponent(url)}`} />

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
