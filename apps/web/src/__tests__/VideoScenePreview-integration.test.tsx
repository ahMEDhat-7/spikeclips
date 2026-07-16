import { render, screen } from "@testing-library/react";
import { VideoScenePreview } from "@/presentation/components/video/VideoScenePreview";
import { Job } from "@/domain/entities/job";

jest.mock("react-youtube", () => {
  return function MockYouTube() {
    return <div data-testid="youtube-player" />;
  };
});

const mockJob: Job = {
  id: "job-1",
  userId: "user-1",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  status: "completed",
  createdAt: "2025-01-01",
  scenes: [
    { start_time: 0, end_time: 5, duration: 5, peak_intensity: 0.85, avg_intensity: 0.78, score: 0.82, confidence: "high", capped: false },
    { start_time: 10, end_time: 15, duration: 5, peak_intensity: 0.72, avg_intensity: 0.65, score: 0.70, confidence: "high", capped: false },
  ],
};

describe("VideoScenePreview", () => {
  const mockOnSceneSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the YouTube player", () => {
    render(<VideoScenePreview job={mockJob} />);
    expect(screen.getByTestId("youtube-player")).toBeTruthy();
  });

  it("renders time overlay for selected scene", () => {
    render(<VideoScenePreview job={mockJob} selectedSceneIndex={0} />);
    expect(screen.getByText(/S1:.*0:00.*0:05/)).toBeTruthy();
  });

  it("calls onSceneSelect when skip forward is clicked", () => {
    render(<VideoScenePreview job={mockJob} selectedSceneIndex={0} onSceneSelect={mockOnSceneSelect} />);
    const skipButtons = screen.getAllByRole("button");
    const skipForward = skipButtons[skipButtons.length - 1];
    skipForward.click();
    expect(mockOnSceneSelect).toHaveBeenCalledWith(1);
  });

  it("shows time display", () => {
    render(<VideoScenePreview job={mockJob} />);
    expect(screen.getByText(/0:00/)).toBeTruthy();
  });

  it("renders play button", () => {
    render(<VideoScenePreview job={mockJob} />);
    const playButtons = screen.getAllByRole("button");
    expect(playButtons.length).toBeGreaterThan(0);
  });

  it("handles job with no scenes", () => {
    const jobNoScenes: Job = { ...mockJob, scenes: undefined };
    render(<VideoScenePreview job={jobNoScenes} />);
    expect(screen.getByTestId("youtube-player")).toBeTruthy();
  });
});
