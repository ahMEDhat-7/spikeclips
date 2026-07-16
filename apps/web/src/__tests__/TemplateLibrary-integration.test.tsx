import { render, screen } from "@testing-library/react";
import { TemplateLibrary } from "@/presentation/components/studio/TemplateLibrary";
import { EditTemplate } from "@/domain/entities/template";

const mockTemplate: EditTemplate = {
  id: "kinetic-1",
  name: "Kinetic Pulse",
  description: "Energetic motion template",
  category: "kinetic",
  preview: "",
  config: {
    textAnimation: "pop",
    transitionIn: "cut",
    transitionOut: "fade",
    layout: "full",
    textPosition: "center",
    textStyle: "bold",
    overlayEffects: [],
  },
};

jest.mock("@/domain/data/templates", () => ({
  TEMPLATES: [
    {
      id: "kinetic-1",
      name: "Kinetic Pulse",
      description: "Energetic motion template",
      category: "kinetic",
      preview: "",
      config: {
        textAnimation: "pop",
        transitionIn: "cut",
        transitionOut: "fade",
        layout: "full",
        textPosition: "center",
        textStyle: "bold",
        overlayEffects: [],
      },
    },
  ],
}));

describe("TemplateLibrary", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders template cards", () => {
    render(<TemplateLibrary selectedTemplate={null} onSelect={mockOnSelect} />);
    expect(screen.getByText("Kinetic Pulse")).toBeTruthy();
  });

  it("calls onSelect when template is clicked", () => {
    render(<TemplateLibrary selectedTemplate={null} onSelect={mockOnSelect} />);
    screen.getByText("Kinetic Pulse").click();
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it("shows selected template name", () => {
    render(<TemplateLibrary selectedTemplate={mockTemplate} onSelect={mockOnSelect} />);
    expect(screen.getByText(/Selected:.*Kinetic Pulse/)).toBeTruthy();
  });

  it("renders category filter buttons", () => {
    render(<TemplateLibrary selectedTemplate={null} onSelect={mockOnSelect} />);
    expect(screen.getByText("All")).toBeTruthy();
  });

  it("shows description when template is selected", () => {
    render(<TemplateLibrary selectedTemplate={mockTemplate} onSelect={mockOnSelect} />);
    expect(screen.getByText("Energetic motion template")).toBeTruthy();
  });
});
