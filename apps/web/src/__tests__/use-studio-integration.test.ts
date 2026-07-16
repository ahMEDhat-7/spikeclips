import { renderHook, act } from "@testing-library/react";
import { useStudio } from "@/application/hooks/use-studio";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => "/studio",
}));

describe("useStudio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with platform step and default values", () => {
    const { result } = renderHook(() => useStudio());
    expect(result.current.currentStep).toBe("platform");
    expect(result.current.platform).toBeNull();
    expect(result.current.scenes).toEqual([]);
    expect(result.current.selectedSceneIndex).toBeNull();
  });

  it("sets platform", () => {
    const { result } = renderHook(() => useStudio());
    act(() => {
      result.current.setPlatform({ id: "tiktok", label: "TikTok", ratio: "9:16" });
    });
    expect(result.current.platform).not.toBeNull();
  });

  it("advances step with goNext when conditions met", () => {
    const { result } = renderHook(() => useStudio());
    act(() => {
      result.current.setPlatform({ id: "tiktok", label: "TikTok", ratio: "9:16" });
    });
    act(() => {
      result.current.goNext();
    });
    expect(result.current.currentStep).toBe("scenes");
  });

  it("goes back with goPrev", () => {
    const { result } = renderHook(() => useStudio());
    act(() => {
      result.current.setPlatform({ id: "tiktok", label: "TikTok", ratio: "9:16" });
    });
    act(() => { result.current.goNext(); });
    act(() => { result.current.goPrev(); });
    expect(result.current.currentStep).toBe("platform");
  });

  it("selects a scene and advances to captions", () => {
    const { result } = renderHook(() => useStudio());
    act(() => {
      result.current.selectScene(2);
    });
    expect(result.current.selectedSceneIndex).toBe(2);
    expect(result.current.currentStep).toBe("captions");
  });

  it("goToStep sets the step directly", () => {
    const { result } = renderHook(() => useStudio());
    act(() => { result.current.goToStep("export"); });
    expect(result.current.currentStep).toBe("export");
  });

  it("reset returns to initial state", () => {
    const { result } = renderHook(() => useStudio());
    act(() => {
      result.current.setPlatform({ id: "tiktok", label: "TikTok", ratio: "9:16" });
      result.current.selectScene(0);
    });
    act(() => { result.current.reset(); });
    expect(result.current.currentStep).toBe("platform");
    expect(result.current.platform).toBeNull();
    expect(result.current.scenes).toEqual([]);
  });

  it("reports canGoNext correctly", () => {
    const { result } = renderHook(() => useStudio());
    expect(result.current.canGoNext).toBe(false);
    act(() => {
      result.current.setPlatform({ id: "tiktok", label: "TikTok", ratio: "9:16" });
    });
    expect(result.current.canGoNext).toBe(true);
  });

  it("reports isFirstStep and isLastStep", () => {
    const { result } = renderHook(() => useStudio());
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
    act(() => { result.current.goToStep("export"); });
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.isFirstStep).toBe(false);
  });
});
