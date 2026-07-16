import {
  FPS,
  POLLING_INTERVAL_MS,
  ANALYSIS_POLL_INTERVAL_MS,
  ANALYSIS_MAX_POLL_ATTEMPTS,
  VIDEO_UPDATE_INTERVAL_MS,
  SUCCESS_MESSAGE_TIMEOUT_MS,
  HERO_ANIMATION_DURATION_MS,
} from "@/lib/constants";

describe("constants", () => {
  it("FPS is 30", () => {
    expect(FPS).toBe(30);
  });

  it("POLLING_INTERVAL_MS is 2000", () => {
    expect(POLLING_INTERVAL_MS).toBe(2000);
  });

  it("ANALYSIS_POLL_INTERVAL_MS is 3000", () => {
    expect(ANALYSIS_POLL_INTERVAL_MS).toBe(3000);
  });

  it("ANALYSIS_MAX_POLL_ATTEMPTS is 120", () => {
    expect(ANALYSIS_MAX_POLL_ATTEMPTS).toBe(120);
  });

  it("VIDEO_UPDATE_INTERVAL_MS is 250", () => {
    expect(VIDEO_UPDATE_INTERVAL_MS).toBe(250);
  });

  it("SUCCESS_MESSAGE_TIMEOUT_MS is 3000", () => {
    expect(SUCCESS_MESSAGE_TIMEOUT_MS).toBe(3000);
  });

  it("HERO_ANIMATION_DURATION_MS is 12000", () => {
    expect(HERO_ANIMATION_DURATION_MS).toBe(12000);
  });
});
