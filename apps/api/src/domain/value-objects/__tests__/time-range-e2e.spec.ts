import { TimeRange } from "../time-range";

describe("TimeRange (e2e)", () => {
  describe("constructor", () => {
    it("creates a valid time range", () => {
      const range = new TimeRange(10, 20);
      expect(range.start).toBe(10);
      expect(range.end).toBe(20);
    });

    it("creates a zero-length range", () => {
      const range = new TimeRange(5, 5);
      expect(range.start).toBe(5);
      expect(range.end).toBe(5);
    });
  });

  describe("validation", () => {
    it("rejects negative start", () => {
      expect(() => new TimeRange(-1, 10)).toThrow("Start time cannot be negative");
    });

    it("rejects end before start", () => {
      expect(() => new TimeRange(20, 10)).toThrow("End time must be after start time");
    });
  });

  describe("getDuration", () => {
    it("calculates duration correctly", () => {
      const range = new TimeRange(10, 25);
      expect(range.getDuration()).toBe(15);
    });

    it("calculates zero duration", () => {
      const range = new TimeRange(5, 5);
      expect(range.getDuration()).toBe(0);
    });
  });

  describe("overlaps", () => {
    it("detects overlapping ranges", () => {
      const range1 = new TimeRange(10, 20);
      const range2 = new TimeRange(15, 25);
      expect(range1.overlaps(range2)).toBe(true);
    });

    it("detects non-overlapping ranges", () => {
      const range1 = new TimeRange(10, 15);
      const range2 = new TimeRange(20, 25);
      expect(range1.overlaps(range2)).toBe(false);
    });

    it("detects adjacent ranges as non-overlapping", () => {
      const range1 = new TimeRange(10, 15);
      const range2 = new TimeRange(15, 20);
      expect(range1.overlaps(range2)).toBe(false);
    });
  });

  describe("contains", () => {
    it("detects contained point", () => {
      const range = new TimeRange(10, 20);
      expect(range.contains(15)).toBe(true);
    });

    it("detects point at start boundary", () => {
      const range = new TimeRange(10, 20);
      expect(range.contains(10)).toBe(true);
    });

    it("detects point at end boundary", () => {
      const range = new TimeRange(10, 20);
      expect(range.contains(20)).toBe(true);
    });

    it("detects point outside range", () => {
      const range = new TimeRange(10, 20);
      expect(range.contains(25)).toBe(false);
    });
  });
});
