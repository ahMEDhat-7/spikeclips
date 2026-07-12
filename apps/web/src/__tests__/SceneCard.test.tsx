import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SceneCard } from "../presentation/components/scenes/SceneCard";

const mockScene = {
  start_time: 100,
  end_time: 120,
  duration: 20,
  peak_intensity: 0.85,
  avg_intensity: 0.72,
  score: 0.78,
  confidence: "high" as const,
  capped: false,
};

describe("SceneCard", () => {
  it("renders time range", () => {
    render(
      <SceneCard scene={mockScene} index={0} isSelected={false} onToggle={() => {}} />
    );
    expect(screen.getByText("1:40 – 2:00")).toBeInTheDocument();
  });

  it("renders duration badge", () => {
    render(
      <SceneCard scene={mockScene} index={0} isSelected={false} onToggle={() => {}} />
    );
    expect(screen.getByText("20.0s")).toBeInTheDocument();
  });

  it("renders peak intensity and score", () => {
    render(
      <SceneCard scene={mockScene} index={0} isSelected={false} onToggle={() => {}} />
    );
    expect(screen.getByText(/Peak: 85%/)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0.78/)).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = jest.fn();
    render(
      <SceneCard scene={mockScene} index={0} isSelected={false} onToggle={onToggle} />
    );
    screen.getByText("1:40 – 2:00").click();
    expect(onToggle).toHaveBeenCalledWith(0);
  });
});
