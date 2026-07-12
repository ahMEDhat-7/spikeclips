import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Scissors,
  Zap,
  Shield,
  Activity,
  Layers,
  Clock,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover how SpikeClip uses real YouTube heatmap data to identify the most-replayed moments and create engaging vertical shorts.",
};

const features = [
  {
    icon: BarChart3,
    title: "Real Heatmap Data",
    description:
      "Extracts actual viewer engagement data directly from YouTube's heatmap API. Every data point represents real human attention — not algorithmic guesses.",
    details: [
      "Direct YouTube heatmap extraction",
      "Per-second viewer engagement scores",
      "Normalized intensity mapping",
    ],
  },
  {
    icon: Activity,
    title: "Spike Merging Algorithm",
    description:
      "Our proprietary algorithm intelligently merges adjacent high-intensity moments into coherent clips, respecting natural scene boundaries.",
    details: [
      "Gap-tolerant spike clustering",
      "Intensity-based scoring",
      "Configurable clip duration (3-60s)",
    ],
  },
  {
    icon: Scissors,
    title: "Vertical Reformatting",
    description:
      "Automatically crops and reformats landscape videos to 9:16 vertical format optimized for TikTok, YouTube Shorts, and Instagram Reels.",
    details: [
      "Smart center-crop algorithm",
      "9:16 aspect ratio optimization",
      "Keyframe-accurate cuts",
    ],
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Heatmap extraction completes in under 10 seconds. The spike merging algorithm runs in milliseconds. From URL to clips in under a minute.",
    details: [
      "Sub-10s heatmap extraction",
      "Millisecond algorithm execution",
      "Parallel clip generation",
    ],
  },
  {
    icon: Target,
    title: "Data-Driven Decisions",
    description:
      "Stop guessing which moments to clip. Let actual viewer behavior guide your content strategy with quantified engagement metrics.",
    details: [
      "Peak intensity scoring",
      "Confidence levels per scene",
      "Exportable analytics",
    ],
  },
  {
    icon: Layers,
    title: "Multi-Platform Export",
    description:
      "Download clips ready for every major short-form platform. One analysis, multiple content opportunities.",
    details: [
      "TikTok-optimized format",
      "YouTube Shorts ready",
      "Instagram Reels compatible",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Paste YouTube URL",
    description:
      "Drop in any YouTube video link. We validate the URL and extract heatmap data automatically.",
  },
  {
    number: "02",
    title: "View Heatmap Analysis",
    description:
      "See exactly where viewers rewatched. Our visualization highlights peak engagement moments with clear intensity mapping.",
  },
  {
    number: "03",
    title: "Select Scenes",
    description:
      "Review detected scenes ranked by engagement score. Select the moments that fit your content strategy.",
  },
  {
    number: "04",
    title: "Export Vertical Clips",
    description:
      "Download clips reformatted for vertical platforms. Keyframe-accurate cuts with no black bars or upscaling artifacts.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="space-y-16">
      <section className="container mx-auto px-4 sm:px-6 pt-16 pb-12 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Features built for{" "}
          <span className="text-primary">data-driven</span> creators
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Every feature is designed to turn raw viewer engagement data into
          actionable content insights.
        </p>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="h-1 w-1 rounded-full bg-secondary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border" />
                )}
                <div className="space-y-3">
                  <span className="text-3xl font-mono font-bold text-primary/20">
                    {step.number}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Start analyzing with real data
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
