export interface Platform {
  id: string;
  name: string;
  icon: string;
  aspectRatio: string;
  maxDuration: number;
  description: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    icon: "Youtube",
    aspectRatio: "9:16",
    maxDuration: 60,
    description: "Vertical short-form video, up to 60 seconds",
  },
  {
    id: "instagram-reels",
    name: "Instagram Reels",
    icon: "Instagram",
    aspectRatio: "9:16",
    maxDuration: 90,
    description: "Vertical reels, up to 90 seconds",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "Music2",
    aspectRatio: "9:16",
    maxDuration: 180,
    description: "Vertical videos, up to 3 minutes",
  },
];
