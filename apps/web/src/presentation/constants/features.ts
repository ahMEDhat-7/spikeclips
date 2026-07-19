import {
  BarChart3,
  Scissors,
  Zap,
  Shield,
  Activity,
  Layers,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface DetailedFeature extends LandingFeature {
  details: string[];
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: BarChart3,
    title: "Real viewer data",
    description:
      "Uses actual YouTube heatmap data — not AI guesses — to find moments viewers truly rewatch.",
  },
  {
    icon: Scissors,
    title: "Vertical reformatting",
    description:
      "Automatically crops and reformats clips to 9:16 for TikTok, Shorts, and Reels.",
  },
  {
    icon: Zap,
    title: "Instant analysis",
    description:
      "Heatmap extraction in under 10 seconds. Spike merging algorithm runs in milliseconds.",
  },
  {
    icon: Shield,
    title: "Data-driven decisions",
    description:
      "Stop guessing which moments to clip. Let actual viewer behavior guide your edits.",
  },
];

export const DETAILED_FEATURES: DetailedFeature[] = [
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
    title: "Spike Merging Algorithm v2",
    description:
      "Proprietary algorithm with gap-tolerant clustering and intensity scoring. Merges adjacent high-engagement moments into coherent clips respecting natural scene boundaries.",
    details: [
      "Gap-tolerant clustering (5s tolerance)",
      "Intensity delta scoring (0.25 threshold)",
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
