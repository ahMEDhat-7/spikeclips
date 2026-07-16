import { render, screen } from "@testing-library/react";
import { SceneCard } from "@/presentation/components/scenes/SceneCard";
import { ScoredBlock } from "@/domain/entities/job";

const mockScene: ScoredBlock = {
  start_time: 0,
  end_time: 5,
  duration: 5,
  peak_intensity: 0.85,
  avg_intensity: 0.78,
  score: 0.82,
  confidence: "high",
  capped: false,
};

describe("SceneCard", () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders time range", () => {
    render(<SceneCard scene={mockScene} index={0} isSelected={false} onToggle={mockOnToggle} />);
    expect(screen.getByText("0:00 – 0:05")).toBeTruthy();
  });

  it("renders duration badge", () => {
    render(<SceneCard scene={mockScene} index={0} isSelected={false} onToggle={mockOnToggle} />);
    expect(screen.getByText("5.0s")).toBeTruthy();
  });

  it("renders peak intensity", () => {
    render(<SceneCard scene={mockScene} index={0} isSelected={false} onToggle={mockOnToggle} />);
    expect(screen.getByText("85%")).toBeTruthy();
  });

  it("renders score", () => {
    render(<SceneCard scene={mockScene} index={0} isSelected={false} onToggle={mockOnToggle} />);
    expect(screen.getByText("0.82")).toBeTruthy();
  });

  it("calls onToggle when clicked", () => {
    render(<SceneCard scene={mockScene} index={3} isSelected={false} onToggle={mockOnToggle} />);
    screen.getByText("0:00 – 0:05").click();
    expect(mockOnToggle).toHaveBeenCalledWith(3);
  });

  it("shows selected state", () => {
    render(<SceneCard scene={mockScene} index={0} isSelected={true} onToggle={mockOnToggle} />);
    expect(screen.getByRole("checkbox")).toBeTruthy();
  });
});
