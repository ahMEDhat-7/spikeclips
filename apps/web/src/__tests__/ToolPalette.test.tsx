import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToolPalette } from "../presentation/components/studio/ToolPalette";

const defaultProps = {
  currentStep: "platform" as const,
  onStepChange: jest.fn(),
  expanded: false,
  onToggleExpand: jest.fn(),
};

describe("ToolPalette", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all 6 tool buttons", () => {
    render(<ToolPalette {...defaultProps} />);
    expect(screen.getByLabelText("Platform")).toBeInTheDocument();
    expect(screen.getByLabelText("Scenes")).toBeInTheDocument();
    expect(screen.getByLabelText("Captions")).toBeInTheDocument();
    expect(screen.getByLabelText("Music")).toBeInTheDocument();
    expect(screen.getByLabelText("Templates")).toBeInTheDocument();
    expect(screen.getByLabelText("Export")).toBeInTheDocument();
  });

  it("highlights the active step", () => {
    render(<ToolPalette {...defaultProps} currentStep="scenes" />);
    const scenesBtn = screen.getByLabelText("Scenes");
    expect(scenesBtn).toHaveClass("bg-primary");
  });

  it("calls onStepChange when a tool is clicked", () => {
    const onStepChange = jest.fn();
    render(<ToolPalette {...defaultProps} onStepChange={onStepChange} />);

    fireEvent.click(screen.getByLabelText("Captions"));
    expect(onStepChange).toHaveBeenCalledWith("captions");
  });

  it("shows expand button", () => {
    render(<ToolPalette {...defaultProps} />);
    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument();
  });

  it("shows collapse button when expanded", () => {
    render(<ToolPalette {...defaultProps} expanded={true} />);
    expect(screen.getByLabelText("Collapse sidebar")).toBeInTheDocument();
  });

  it("calls onToggleExpand when expand/collapse is clicked", () => {
    const onToggleExpand = jest.fn();
    render(<ToolPalette {...defaultProps} onToggleExpand={onToggleExpand} />);

    fireEvent.click(screen.getByLabelText("Expand sidebar"));
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it("shows labels when expanded", () => {
    render(<ToolPalette {...defaultProps} expanded={true} />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Scenes")).toBeInTheDocument();
    expect(screen.getByText("Captions")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("does not show labels when collapsed", () => {
    render(<ToolPalette {...defaultProps} expanded={false} />);
    expect(screen.queryByText("Platform")).not.toBeInTheDocument();
    expect(screen.queryByText("Scenes")).not.toBeInTheDocument();
  });
});
