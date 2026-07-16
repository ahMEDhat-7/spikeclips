import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StudioLayout } from "../presentation/components/studio/StudioLayout";

describe("StudioLayout", () => {
  it("renders toolbar", () => {
    render(
      <StudioLayout
        toolbar={<div data-testid="toolbar">Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
      />
    );
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
  });

  it("renders left sidebar", () => {
    render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div data-testid="left">Left</div>}
        center={<div>Center</div>}
      />
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
  });

  it("renders center content", () => {
    render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div data-testid="center">Center</div>}
      />
    );
    expect(screen.getByTestId("center")).toBeInTheDocument();
  });

  it("renders right sidebar when provided", () => {
    render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
        right={<div data-testid="right">Right</div>}
      />
    );
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("does not render right sidebar when not provided", () => {
    render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
      />
    );
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("renders bottom when provided", () => {
    render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
        bottom={<div data-testid="bottom">Bottom</div>}
      />
    );
    expect(screen.getByTestId("bottom")).toBeInTheDocument();
  });

  it("applies expanded width class when leftExpanded is true", () => {
    const { container } = render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
        leftExpanded={true}
      />
    );
    const aside = container.querySelector('aside[aria-label="Studio tools"]');
    expect(aside).toHaveClass("w-48");
  });

  it("applies collapsed width class when leftExpanded is false", () => {
    const { container } = render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
        leftExpanded={false}
      />
    );
    const aside = container.querySelector('aside[aria-label="Studio tools"]');
    expect(aside).toHaveClass("w-14");
  });

  it("has fixed positioning", () => {
    const { container } = render(
      <StudioLayout
        toolbar={<div>Toolbar</div>}
        left={<div>Left</div>}
        center={<div>Center</div>}
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("fixed", "inset-0");
  });
});
