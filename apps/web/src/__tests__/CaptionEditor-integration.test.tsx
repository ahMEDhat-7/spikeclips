import { render, screen } from "@testing-library/react";
import { CaptionEditor } from "@/presentation/components/studio/CaptionEditor";
import { Caption } from "@/domain/entities/caption";

const mockCaption: Caption = {
  id: "cap-1",
  text: "Test Caption",
  font: "inter",
  size: 32,
  color: "#FFFFFF",
  position: "bottom",
  startFrame: 0,
  endFrame: 150,
  textStyle: "bold",
  textAlign: "center",
  opacity: 1,
  backgroundColor: "#000000",
  backgroundEnabled: false,
  strokeWidth: 0,
  shadowRadius: 0,
  animation: "none",
  sceneIndex: 0,
};

describe("CaptionEditor", () => {
  const mockOnAdd = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no captions", () => {
    render(
      <CaptionEditor
        captions={[]}
        sceneCount={5}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText("No captions yet. Click \"Add\" to create one.")).toBeTruthy();
  });

  it("renders Add button", () => {
    render(
      <CaptionEditor
        captions={[]}
        sceneCount={5}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText("Add")).toBeTruthy();
  });

  it("calls onAdd when Add is clicked", () => {
    render(
      <CaptionEditor
        captions={[]}
        sceneCount={5}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    screen.getByText("Add").click();
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it("renders caption when provided", () => {
    render(
      <CaptionEditor
        captions={[mockCaption]}
        sceneCount={5}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByDisplayValue("Test Caption")).toBeTruthy();
  });

  it("displays caption count", () => {
    render(
      <CaptionEditor
        captions={[mockCaption]}
        sceneCount={5}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText("1 caption for this scene")).toBeTruthy();
  });
});
