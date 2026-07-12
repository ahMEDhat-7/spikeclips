import Link from "next/link";
import { UrlInput } from "@/presentation/components/jobs/UrlInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Scissors, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real viewer data",
    description: "Uses actual YouTube heatmap data — not AI guesses — to find moments viewers truly rewatch.",
  },
  {
    icon: Scissors,
    title: "Vertical reformatting",
    description: "Automatically crops and reformats clips to 9:16 for TikTok, Shorts, and Reels.",
  },
  {
    icon: Zap,
    title: "Instant analysis",
    description: "Heatmap extraction in under 10 seconds. Spike merging algorithm runs in milliseconds.",
  },
  {
    icon: Shield,
    title: "Data-driven decisions",
    description: "Stop guessing which moments to clip. Let actual viewer behavior guide your edits.",
  },
];

export default function HomePage() {
  return (
    <main className="space-y-16">
      <section className="container mx-auto px-4 sm:px-6 pt-16 pb-12 text-center space-y-6">
        <img
          src="/logo.svg"
          alt="SpikeClip logo"
          className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
        />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Find what viewers actually rewatch
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          SpikeClip uses real YouTube heatmap data to identify the most-replayed moments in your videos — then reformats them into vertical shorts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/register">Start for free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-3xl font-bold text-primary">1</div>
              <h3 className="font-semibold">Paste your URL</h3>
              <p className="text-sm text-muted-foreground">
                Drop in any YouTube video link. We validate and extract heatmap data automatically.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-3xl font-bold text-primary">2</div>
              <h3 className="font-semibold">See the heatmap</h3>
              <p className="text-sm text-muted-foreground">
                View exactly where viewers rewatched. Our algorithm identifies the top moments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-3xl font-bold text-primary">3</div>
              <h3 className="font-semibold">Export clips</h3>
              <p className="text-sm text-muted-foreground">
                Select scenes and download vertical clips ready for TikTok, Shorts, or Reels.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Why SpikeClip?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 space-y-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Start clipping with real data
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Free tier includes 3 analyses per month. No credit card required.
        </p>
        <Button asChild size="lg">
          <Link href="/register">Get started free</Link>
        </Button>
      </section>
    </main>
  );
}
