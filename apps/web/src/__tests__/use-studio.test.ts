import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useStudio } from "../application/hooks/use-studio";

beforeEach(() => {
  if (!global.crypto?.randomUUID) {
    Object.defineProperty(global, "crypto", {
      value: { ...global.crypto, randomUUID: () => Math.random().toString(36).slice(2) },
      writable: true,
    });
  }
});

const mockScenes = [
  { start_time: 0, end_time: 10, duration: 10, peak_intensity: 0.8, avg_intensity: 0.7, score: 0.75, confidence: "high" as const, capped: false },
  { start_time: 15, end_time: 25, duration: 10, peak_intensity: 0.9, avg_intensity: 0.8, score: 0.85, confidence: "high" as const, capped: false },
  { start_time: 30, end_time: 40, duration: 10, peak_intensity: 0.7, avg_intensity: 0.6, score: 0.65, confidence: "high" as const, capped: false },
];

const mockPlatform = {
  id: "youtube-shorts",
  name: "YouTube Shorts",
  icon: "Youtube",
  aspectRatio: "9:16",
  maxDuration: 60,
  description: "Vertical short-form video",
};

describe("useStudio", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useStudio());

    expect(result.current.platform).toBeNull();
    expect(result.current.scenes).toEqual([]);
    expect(result.current.selectedSceneIndex).toBeNull();
    expect(result.current.selectedScenes).toEqual([]);
    expect(result.current.currentSceneEdit).toBeNull();
    expect(result.current.captions).toEqual([]);
    expect(result.current.musicTrack).toBeNull();
    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.currentStep).toBe("platform");
    expect(result.current.outputFormat).toBe("mp4");
    expect(result.current.outputQuality).toBe("1080p");
  });

  it("has correct step order", () => {
    const { result } = renderHook(() => useStudio());
    expect(result.current.steps).toEqual([
      "platform", "scenes", "captions", "music", "templates", "export",
    ]);
  });

  it("canGoNext depends on platform selection", () => {
    const { result } = renderHook(() => useStudio());

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.setPlatform(mockPlatform);
    });

    expect(result.current.canGoNext).toBe(true);
  });

  it("navigates between steps", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.setPlatform(mockPlatform);
    });

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentStep).toBe("scenes");
    expect(result.current.isFirstStep).toBe(false);

    act(() => {
      result.current.goPrev();
    });

    expect(result.current.currentStep).toBe("platform");
    expect(result.current.isFirstStep).toBe(true);
  });

  it("canGoPrev is false on first step", () => {
    const { result } = renderHook(() => useStudio());
    expect(result.current.canGoPrev).toBe(false);
  });

  it("canGoPrev is true after navigating forward", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.goToStep("scenes");
    });

    expect(result.current.canGoPrev).toBe(true);
  });

  it("isLastStep is true on export step", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.goToStep("export");
    });

    expect(result.current.isLastStep).toBe(true);
  });

  it("selects a single scene and auto-advances to captions", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.initFromJob(mockScenes);
    });

    expect(result.current.selectedSceneIndex).toBeNull();
    expect(result.current.selectedScenes).toEqual([]);

    act(() => {
      result.current.selectScene(1);
    });

    expect(result.current.selectedSceneIndex).toBe(1);
    expect(result.current.selectedScenes).toEqual([1]);
    expect(result.current.currentStep).toBe("captions");
  });

  it("adds and removes captions for selected scene", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.initFromJob(mockScenes);
      result.current.selectScene(0);
    });

    act(() => {
      result.current.addCaption({ text: "Hello" });
    });

    expect(result.current.captions).toHaveLength(1);
    expect(result.current.captions[0].text).toBe("Hello");

    const captionId = result.current.captions[0].id;

    act(() => {
      result.current.removeCaption(captionId);
    });

    expect(result.current.captions).toHaveLength(0);
  });

  it("updates caption", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.initFromJob(mockScenes);
      result.current.selectScene(0);
    });

    act(() => {
      result.current.addCaption({ text: "Hello" });
    });

    const captionId = result.current.captions[0].id;

    act(() => {
      result.current.updateCaption(captionId, { text: "World", color: "#FF0000" });
    });

    expect(result.current.captions[0].text).toBe("World");
    expect(result.current.captions[0].color).toBe("#FF0000");
  });

  it("resets all state", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.setPlatform(mockPlatform);
      result.current.initFromJob(mockScenes);
      result.current.selectScene(0);
      result.current.addCaption({ text: "Test" });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.platform).toBeNull();
    expect(result.current.scenes).toEqual([]);
    expect(result.current.selectedSceneIndex).toBeNull();
    expect(result.current.currentStep).toBe("platform");
  });

  it("canGoNext is false on scenes step with no selected scene", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.goToStep("scenes");
    });

    expect(result.current.canGoNext).toBe(false);
  });

  it("canGoNext is true on scenes step with selected scene", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.setPlatform(mockPlatform);
      result.current.initFromJob(mockScenes);
      result.current.goToStep("scenes");
      result.current.selectScene(0);
    });

    expect(result.current.canGoNext).toBe(true);
  });

  it("switches between scenes and updates currentSceneEdit", () => {
    const { result } = renderHook(() => useStudio());

    act(() => {
      result.current.initFromJob(mockScenes);
    });

    act(() => {
      result.current.selectScene(0);
    });

    act(() => {
      result.current.addCaption({ text: "Scene 0 caption" });
    });

    expect(result.current.captions).toHaveLength(1);
    expect(result.current.captions[0].text).toBe("Scene 0 caption");

    act(() => {
      result.current.selectScene(1);
    });

    expect(result.current.captions).toHaveLength(0);

    act(() => {
      result.current.addCaption({ text: "Scene 1 caption" });
    });

    expect(result.current.captions).toHaveLength(1);
    expect(result.current.captions[0].text).toBe("Scene 1 caption");

    act(() => {
      result.current.selectScene(0);
    });

    expect(result.current.captions).toHaveLength(1);
    expect(result.current.captions[0].text).toBe("Scene 0 caption");
  });
});
