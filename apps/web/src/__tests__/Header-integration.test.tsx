import { render, screen } from "@testing-library/react";
import { Header } from "@/presentation/components/layout/Header";

jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("@/application/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    logout: jest.fn(),
  }),
}));

describe("Header", () => {
  it("renders logo", () => {
    render(<Header />);
    expect(screen.getByText("Spike")).toBeTruthy();
  });

  it("renders Sign In and Sign Up when not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Sign In")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Features")).toBeTruthy();
    expect(screen.getByText("Pricing")).toBeTruthy();
  });

  it("renders theme toggle", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeTruthy();
  });

  it("renders mobile menu toggle", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeTruthy();
  });
});
