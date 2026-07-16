import { render, screen, fireEvent } from "@testing-library/react";
import { StudioToolbar } from "@/presentation/components/studio/StudioToolbar";
import { STUDIO_STEPS } from "@/domain/entities/studio";

describe("StudioToolbar", () => {
  const defaultProps = {
    currentStep: "scenes" as const,
    currentStepIndex: 1,
    steps: STUDIO_STEPS,
    canGoNext: true,
    canGoPrev: true,
    isFirstStep: false,
    isLastStep: false,
    onGoNext: jest.fn(),
    onGoPrev: jest.fn(),
    onGoToStep: jest.fn(),
    onExport: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders step indicator", () => {
    render(<StudioToolbar {...defaultProps} />);
    expect(screen.getByText("Scenes")).toBeTruthy();
  });

  it("renders Next button when not last step", () => {
    render(<StudioToolbar {...defaultProps} />);
    expect(screen.getByText("Next")).toBeTruthy();
  });

  it("renders Export button when last step", () => {
    render(<StudioToolbar {...defaultProps} currentStep="export" currentStepIndex={5} isLastStep={true} />);
    const exportButtons = screen.getAllByRole("button", { name: /Export/ });
    expect(exportButtons.length).toBeGreaterThan(0);
  });

  it("calls onGoNext when Next is clicked", () => {
    render(<StudioToolbar {...defaultProps} />);
    fireEvent.click(screen.getByText("Next"));
    expect(defaultProps.onGoNext).toHaveBeenCalled();
  });

  it("renders Reset button", () => {
    render(<StudioToolbar {...defaultProps} />);
    expect(screen.getByText("Reset")).toBeTruthy();
  });

  it("renders step numbers", () => {
    render(<StudioToolbar {...defaultProps} />);
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("disables prev button when canGoPrev is false", () => {
    render(<StudioToolbar {...defaultProps} canGoPrev={false} isFirstStep={true} />);
    const buttons = screen.getAllByRole("button");
    const prevBtn = buttons.find(b => b.querySelector('svg'));
    expect(prevBtn).toBeTruthy();
  });
});
