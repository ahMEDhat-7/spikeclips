import { TimeRange } from "../time-range";

describe("TimeRange", () => {
  it("creates a valid time range", () => {
    const range = new TimeRange(10, 20);
    expect(range.start).toBe(10);
    expect(range.end).toBe(20);
    expect(range.getDuration()).toBe(10);
  });

  it("rejects negative start", () => {
    expect(() => new TimeRange(-1, 10)).toThrow("Start time cannot be negative");
  });

  it("rejects end before start", () => {
    expect(() => new TimeRange(20, 10)).toThrow("End time must be after start time");
  });

  it("detects overlapping ranges", () => {
    const a = new TimeRange(10, 20);
    const b = new TimeRange(15, 25);
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  it("detects non-overlapping ranges", () => {
    const a = new TimeRange(10, 20);
    const b = new TimeRange(30, 40);
    expect(a.overlaps(b)).toBe(false);
    expect(b.overlaps(a)).toBe(false);
  });

  it("detects containment", () => {
    const range = new TimeRange(10, 30);
    expect(range.contains(15)).toBe(true);
    expect(range.contains(10)).toBe(true);
    expect(range.contains(30)).toBe(true);
    expect(range.contains(5)).toBe(false);
    expect(range.contains(35)).toBe(false);
  });

  it("handles equal start and end (zero duration)", () => {
    const range = new TimeRange(10, 10);
    expect(range.getDuration()).toBe(0);
  });
});
