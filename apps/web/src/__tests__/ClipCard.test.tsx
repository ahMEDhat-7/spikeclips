import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ClipCard } from "../presentation/components/clips/ClipCard";

const mockClip = {
  id: "clip-1",
  jobId: "job-1",
  sceneIndex: 0,
  startTime: 100,
  endTime: 120,
  peakIntensity: 0.85,
  status: "completed",
  fileUrl: "/api/clips/clip-1/download",
  fileSize: 1048576,
  duration: 20,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("ClipCard", () => {
  it("renders scene number", () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByText("Scene 1")).toBeInTheDocument();
  });

  it("renders time range", () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByText("1:40 – 2:00")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("renders file size", () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByText("1.0 MB")).toBeInTheDocument();
  });

  it("renders download button when completed", () => {
    render(<ClipCard clip={mockClip} />);
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("shows processing indicator", () => {
    render(<ClipCard clip={{ ...mockClip, status: "processing" }} />);
    expect(screen.getByText("processing")).toBeInTheDocument();
  });
});
