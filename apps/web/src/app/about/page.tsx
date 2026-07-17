import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "SpikeClip uses real YouTube heatmap data to identify the most-replayed moments. Built for creators who value data over guesswork.",
};

const values = [
  {
    icon: BarChart3,
    title: "Data over guesses",
    description:
      "Every recommendation is backed by actual viewer behavior. We don't guess — we measure.",
  },
  {
    icon: Users,
    title: "Creator-first",
    description:
      "Built by creators who were tired of guessing which moments would perform. The tool we wished existed.",
  },
  {
    icon: Target,
    title: "Precision matters",
    description:
      "Keyframe-accurate cuts, no black bars, no upscaling artifacts. Your content deserves professional output.",
  },
  {
    icon: Zap,
    title: "Speed is a feature",
    description:
      "From URL to clips in under a minute. Your workflow shouldn't be bottlenecked by analysis.",
  },
];

const storySections = [
  {
    label: "The problem",
    text: 'Creators spend hours manually reviewing videos to find the "perfect clip moment." Most guess based on intuition, resulting in inconsistent content quality and missed opportunities. Meanwhile, YouTube quietly collects heatmap data showing exactly which moments viewers rewatch — the strongest signal of viral potential.',
  },
  {
    label: "Our approach",
    text: "SpikeClip extracts YouTube heatmap data and uses our v2 spike merging algorithm with gap-tolerant clustering (5s tolerance, 0.25 intensity delta) to identify the most-engaged moments. No AI guesses. No sentiment analysis. Just raw viewer behavior translated into actionable clip suggestions — built with Next.js, NestJS, Clean Architecture, and Prisma.",
  },
  {
    label: "The result",
    text: "Creators get data-driven clip suggestions in under 60 seconds. Every recommendation is backed by actual viewer attention. The result: higher engagement, less guesswork, and a content workflow that scales.",
  },
];

export default function AboutPage() {
  return (
    <main className="space-y-16">
      <section className="container mx-auto px-4 sm:px-6 pt-16 pb-12 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Built for creators who{" "}
          <span className="text-primary">measure</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          SpikeClip was born from a simple frustration: why guess which moments
          to clip when YouTube already tells you what viewers rewatch?
        </p>
      </section>

      <section className="bg-surface py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-10">
            {storySections.map((section) => (
              <div key={section.label} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold">{section.label}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-4">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Our values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready to clip with data?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Join creators using real viewer data to make better content decisions.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Get started free</Link>
        </Button>
      </section>
    </main>
  );
}
