import { render, screen, fireEvent } from "@testing-library/react";
import { ToolPalette } from "@/presentation/components/studio/ToolPalette";

describe("ToolPalette", () => {
  const mockOnStepChange = jest.fn();
  const mockOnToggleExpand = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders tool buttons with labels when expanded", () => {
    render(
      <ToolPalette currentStep="platform" onStepChange={mockOnStepChange} expanded={true} onToggleExpand={mockOnToggleExpand} />
    );
    expect(screen.getByText("Platform")).toBeTruthy();
    expect(screen.getByText("Scenes")).toBeTruthy();
    expect(screen.getByText("Captions")).toBeTruthy();
  });

  it("calls onStepChange when tool is clicked", () => {
    render(
      <ToolPalette currentStep="platform" onStepChange={mockOnStepChange} expanded={true} onToggleExpand={mockOnToggleExpand} />
    );
    fireEvent.click(screen.getByText("Captions"));
    expect(mockOnStepChange).toHaveBeenCalledWith("captions");
  });

  it("highlights active step", () => {
    render(
      <ToolPalette currentStep="captions" onStepChange={mockOnStepChange} expanded={true} onToggleExpand={mockOnToggleExpand} />
    );
    const captionsBtn = screen.getByText("Captions");
    expect(captionsBtn.closest("button")?.className).toContain("primary");
  });

  it("renders expand button when collapsed", () => {
    render(
      <ToolPalette currentStep="platform" onStepChange={mockOnStepChange} expanded={false} onToggleExpand={mockOnToggleExpand} />
    );
    expect(screen.getByRole("button", { name: /expand sidebar/i })).toBeTruthy();
  });

  it("calls onToggleExpand when toggle is clicked", () => {
    render(
      <ToolPalette currentStep="platform" onStepChange={mockOnStepChange} expanded={false} onToggleExpand={mockOnToggleExpand} />
    );
    fireEvent.click(screen.getByRole("button", { name: /expand sidebar/i }));
    expect(mockOnToggleExpand).toHaveBeenCalled();
  });

  it("renders collapse button when expanded", () => {
    render(
      <ToolPalette currentStep="platform" onStepChange={mockOnStepChange} expanded={true} onToggleExpand={mockOnToggleExpand} />
    );
    expect(screen.getByRole("button", { name: /collapse sidebar/i })).toBeTruthy();
  });
});
