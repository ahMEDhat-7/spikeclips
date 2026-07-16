import { render, screen } from "@testing-library/react";
import { CompositePreview } from "@/presentation/components/studio/CompositePreview";
import { Job, ScoredBlock } from "@/domain/entities/job";

jest.mock("react-youtube", () => {
  return function MockYouTube() {
    return <div data-testid="youtube-player" />;
  };
});

jest.mock("@/presentation/components/studio/CaptionOverlay", () => ({
  CaptionOverlay: () => <div data-testid="caption-overlay" />,
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

const mockJob: Job = {
  id: "job-1",
  userId: "user-1",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  status: "completed",
  createdAt: "2025-01-01",
};

const mockScenes: ScoredBlock[] = [
  { start_time: 0, end_time: 5, duration: 5, peak_intensity: 0.85, avg_intensity: 0.78, score: 0.82, confidence: "high", capped: false },
  { start_time: 10, end_time: 15, duration: 5, peak_intensity: 0.72, avg_intensity: 0.65, score: 0.70, confidence: "high", capped: false },
];

describe("CompositePreview", () => {
  const defaultProps = {
    job: mockJob,
    platform: { id: "tiktok", label: "TikTok", ratio: "9:16" } as any,
    captions: [],
    selectedTemplate: null,
    scenes: mockScenes,
    selectedScenes: [0, 1],
    musicTrack: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the YouTube player", () => {
    render(<CompositePreview {...defaultProps} />);
    expect(screen.getByTestId("youtube-player")).toBeTruthy();
  });

  it("renders scene count", () => {
    render(<CompositePreview {...defaultProps} />);
    expect(screen.getByText(/scenes/)).toBeTruthy();
  });

  it("renders scene time-range buttons", () => {
    render(<CompositePreview {...defaultProps} />);
    expect(screen.getByText("0:00 — 0:05")).toBeTruthy();
    expect(screen.getByText("0:10 — 0:15")).toBeTruthy();
  });

  it("highlights active scene button", () => {
    render(<CompositePreview {...defaultProps} />);
    const sceneBtn = screen.getByText("0:00 — 0:05");
    expect(sceneBtn.className).toContain("primary");
  });

  it("renders preview header", () => {
    render(<CompositePreview {...defaultProps} />);
    expect(screen.getByText("Preview")).toBeTruthy();
  });

  it("renders with no platform", () => {
    render(<CompositePreview {...defaultProps} platform={null} />);
    expect(screen.getByTestId("youtube-player")).toBeTruthy();
  });
});
