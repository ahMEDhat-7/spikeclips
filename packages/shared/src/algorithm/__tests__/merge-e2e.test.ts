import { mergeHeatmapSpikes } from "../merge";
import { HeatmapSpike } from "../../types";

describe("Spike Merging Algorithm (e2e)", () => {
  const gapTolerance = 5.0;
  const intensityTolerance = 0.25;
  const minIntensityCutoff = 0.40;

  it("merges adjacent spikes within gap tolerance", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 15, value: 0.8 },
      { start_time: 16, end_time: 20, value: 0.75 },
    ];
    const result = mergeHeatmapSpikes(spikes, gapTolerance, intensityTolerance, minIntensityCutoff);
    expect(result.length).toBe(1);
    expect(result[0].start_time).toBe(10);
    expect(result[0].end_time).toBe(20);
  });

  it("does not merge spikes beyond gap tolerance", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 15, value: 0.8 },
      { start_time: 25, end_time: 30, value: 0.75 },
    ];
    const result = mergeHeatmapSpikes(spikes, gapTolerance, intensityTolerance, minIntensityCutoff);
    expect(result.length).toBe(2);
  });

  it("returns empty array for empty input", () => {
    const result = mergeHeatmapSpikes([], gapTolerance, intensityTolerance, minIntensityCutoff);
    expect(result).toEqual([]);
  });

  it("returns single spike unchanged", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 15, value: 0.8 },
    ];
    const result = mergeHeatmapSpikes(spikes, gapTolerance, intensityTolerance, minIntensityCutoff);
    expect(result.length).toBe(1);
    expect(result[0].start_time).toBe(10);
    expect(result[0].end_time).toBe(15);
  });

  it("handles spikes with similar values", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 5, value: 0.9 },
      { start_time: 6, end_time: 10, value: 0.85 },
      { start_time: 11, end_time: 15, value: 0.88 },
    ];
    const result = mergeHeatmapSpikes(spikes, gapTolerance, intensityTolerance, minIntensityCutoff);
    expect(result.length).toBe(1);
    expect(result[0].start_time).toBe(0);
    expect(result[0].end_time).toBe(15);
  });
});
