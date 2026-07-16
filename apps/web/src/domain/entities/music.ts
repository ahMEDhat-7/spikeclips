export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  trimStart: number;
  trimEnd: number;
}

export function createMusicTrack(overrides?: Partial<MusicTrack>): MusicTrack {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Track",
    url: "",
    duration: 0,
    volume: 0.3,
    fadeIn: 2,
    fadeOut: 2,
    trimStart: 0,
    trimEnd: 0,
    ...overrides,
  };
}
