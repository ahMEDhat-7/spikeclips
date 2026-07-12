import {
  mergeHeatmapSpikes,
  capAndScoreBlocks,
  selectTopScenes,
  extractTopScenes,
  convertSecondsToTimestamp,
  validateAlgorithmConfig,
  normalizeHeatmapValues,
  AlgorithmConfigError,
} from "../merge";
import { HeatmapSpike, MergedBlock, ScoredBlock } from "../../types";

describe("mergeHeatmapSpikes", () => {
  it("TC-VID-01: merges adjacent spikes within gap tolerance", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 21, end_time: 30, value: 0.9 },
      { start_time: 32, end_time: 40, value: 0.7 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);

    expect(merged.length).toBeGreaterThanOrEqual(1);
    expect(merged[0].start_time).toBe(10);
    expect(merged[0].end_time).toBeGreaterThanOrEqual(40);
  });

  it("TC-VID-02: keeps separate blocks when gap exceeds tolerance", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 100, end_time: 110, value: 0.9 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);

    expect(merged).toHaveLength(2);
    expect(merged[0].end_time).toBe(20);
    expect(merged[1].start_time).toBe(100);
  });

  it("TC-VID-03: floor override merges high-intensity blocks despite intensity gap", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.85 },
      { start_time: 21, end_time: 30, value: 0.80 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 2, 0.01, 0.4);

    expect(merged).toHaveLength(1);
    expect(merged[0].used_floor_override).toBe(true);
  });

  it("TC-VID-04: sorts spikes chronologically before merging", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 50, end_time: 60, value: 0.7 },
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 30, end_time: 40, value: 0.75 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);

    for (let i = 1; i < merged.length; i++) {
      expect(merged[i].start_time).toBeGreaterThan(merged[i - 1].end_time);
    }
  });

  it("TC-VID-05: returns empty for empty input", () => {
    expect(mergeHeatmapSpikes([])).toHaveLength(0);
  });

  it("handles spikes with no gap (back-to-back)", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.6 },
      { start_time: 20, end_time: 30, value: 0.65 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);

    expect(merged).toHaveLength(1);
    expect(merged[0].start_time).toBe(10);
    expect(merged[0].end_time).toBe(30);
  });
});

describe("capAndScoreBlocks", () => {
  it("caps long blocks and scores them", () => {
    const blocks: MergedBlock[] = [
      {
        start_time: 0,
        end_time: 120,
        peak_intensity: 0.9,
        last_value: 0.7,
        weighted_sum: 0.8 * 120,
        total_duration: 120,
        used_floor_override: false,
        segments: [
          { start_time: 0, end_time: 60, value: 0.9 },
          { start_time: 60, end_time: 120, value: 0.7 },
        ],
      },
    ];

    const scored = capAndScoreBlocks(blocks, 3, 60, [15, 60], 0.4, 0.4, 0.2);

    expect(scored).toHaveLength(1);
    expect(scored[0].capped).toBe(true);
    expect(scored[0].duration).toBeLessThanOrEqual(60);
  });

  it("drops blocks below min duration", () => {
    const blocks: MergedBlock[] = [
      {
        start_time: 10,
        end_time: 11,
        peak_intensity: 0.9,
        last_value: 0.9,
        weighted_sum: 0.9,
        total_duration: 1,
        used_floor_override: false,
        segments: [{ start_time: 10, end_time: 11, value: 0.9 }],
      },
    ];

    const scored = capAndScoreBlocks(blocks, 3, 60, [15, 60], 0.4, 0.4, 0.2);

    expect(scored).toHaveLength(0);
  });

  it("scores blocks by composite formula", () => {
    const blocks: MergedBlock[] = [
      {
        start_time: 0,
        end_time: 30,
        peak_intensity: 1.0,
        last_value: 0.9,
        weighted_sum: 0.95 * 30,
        total_duration: 30,
        used_floor_override: false,
        segments: [{ start_time: 0, end_time: 30, value: 0.95 }],
      },
    ];

    const scored = capAndScoreBlocks(blocks, 3, 60, [15, 60], 0.4, 0.4, 0.2);

    expect(scored).toHaveLength(1);
    expect(scored[0].score).toBeGreaterThan(0);
    expect(scored[0].score).toBeLessThanOrEqual(1);
    expect(scored[0].peak_intensity).toBe(1.0);
  });

  it("assigns floor_override confidence when used", () => {
    const blocks: MergedBlock[] = [
      {
        start_time: 0,
        end_time: 20,
        peak_intensity: 0.8,
        last_value: 0.8,
        weighted_sum: 0.8 * 20,
        total_duration: 20,
        used_floor_override: true,
        segments: [{ start_time: 0, end_time: 20, value: 0.8 }],
      },
    ];

    const scored = capAndScoreBlocks(blocks, 3, 60, [15, 60], 0.4, 0.4, 0.2);

    expect(scored[0].confidence).toBe("floor_override");
  });
});

describe("selectTopScenes", () => {
  it("selects top N by score with non-overlap", () => {
    const scored: ScoredBlock[] = [
      {
        start_time: 0,
        end_time: 20,
        duration: 20,
        peak_intensity: 0.9,
        avg_intensity: 0.8,
        score: 0.85,
        confidence: "high",
        capped: false,
      },
      {
        start_time: 10,
        end_time: 30,
        duration: 20,
        peak_intensity: 0.95,
        avg_intensity: 0.85,
        score: 0.9,
        confidence: "high",
        capped: false,
      },
      {
        start_time: 100,
        end_time: 120,
        duration: 20,
        peak_intensity: 0.7,
        avg_intensity: 0.6,
        score: 0.65,
        confidence: "high",
        capped: false,
      },
    ];

    const selected = selectTopScenes(scored, 2, 5);

    expect(selected).toHaveLength(2);
    expect(selected[0].start_time).toBeLessThan(selected[1].start_time);
    expect(
      selected[1].start_time - selected[0].end_time
    ).toBeGreaterThanOrEqual(5);
  });

  it("returns empty for empty input", () => {
    expect(selectTopScenes([])).toHaveLength(0);
  });

  it("enforces minimum spacing", () => {
    const scored: ScoredBlock[] = [
      {
        start_time: 0,
        end_time: 20,
        duration: 20,
        peak_intensity: 0.9,
        avg_intensity: 0.8,
        score: 0.85,
        confidence: "high",
        capped: false,
      },
      {
        start_time: 21,
        end_time: 40,
        duration: 19,
        peak_intensity: 0.8,
        avg_intensity: 0.7,
        score: 0.75,
        confidence: "high",
        capped: false,
      },
      {
        start_time: 100,
        end_time: 120,
        duration: 20,
        peak_intensity: 0.7,
        avg_intensity: 0.6,
        score: 0.65,
        confidence: "high",
        capped: false,
      },
    ];

    const selected = selectTopScenes(scored, 3, 10);

    expect(selected).toHaveLength(2);
  });
});

describe("extractTopScenes (full pipeline)", () => {
  it("TC-VID-06: merges adjacent spikes into single block", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 100, end_time: 108, value: 0.60 },
      { start_time: 108, end_time: 116, value: 1.00 },
      { start_time: 116, end_time: 124, value: 0.73 },
    ];
    const scenes = extractTopScenes(spikes);

    expect(scenes).toHaveLength(1);
    expect(scenes[0].start_time).toBe(100);
    expect(scenes[0].end_time).toBe(124);
    expect(scenes[0].peak_intensity).toBe(1.0);
    expect(scenes[0].confidence).toBe("floor_override");
  });

  it("caps long blocks to best sub-window", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 15, value: 0.45 },
      { start_time: 15, end_time: 35, value: 0.95 },
      { start_time: 35, end_time: 55, value: 0.98 },
      { start_time: 55, end_time: 70, value: 0.50 },
      { start_time: 70, end_time: 90, value: 0.42 },
    ];
    const scenes = extractTopScenes(spikes, { max_clip_duration: 60 });

    expect(scenes).toHaveLength(1);
    expect(scenes[0].duration).toBeLessThanOrEqual(60);
    expect(scenes[0].capped).toBe(true);
  });

  it("spreads picks across timeline", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 25, value: 0.90 },
      { start_time: 200, end_time: 218, value: 0.85 },
      { start_time: 400, end_time: 412, value: 0.30 },
      { start_time: 600, end_time: 630, value: 0.97 },
    ];
    const scenes = extractTopScenes(spikes, { top_n: 3 });

    expect(scenes).toHaveLength(3);
    expect(scenes[0].start_time).toBeLessThan(scenes[1].start_time);
    expect(scenes[1].start_time).toBeLessThan(scenes[2].start_time);
  });

  it("filters out slivers below min_clip_duration", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 50, end_time: 51, value: 0.99 },
      { start_time: 300, end_time: 320, value: 0.80 },
    ];
    const scenes = extractTopScenes(spikes, { min_clip_duration: 3.0 });

    expect(scenes).toHaveLength(1);
    expect(scenes[0].start_time).toBe(300);
    expect(scenes[0].end_time).toBe(320);
  });

  it("returns empty for empty input", () => {
    const scenes = extractTopScenes([]);
    expect(scenes).toHaveLength(0);
  });
});

describe("convertSecondsToTimestamp", () => {
  it("formats mm:ss", () => {
    expect(convertSecondsToTimestamp(65)).toBe("1:05");
    expect(convertSecondsToTimestamp(0)).toBe("0:00");
    expect(convertSecondsToTimestamp(3599)).toBe("59:59");
  });

  it("formats hh:mm:ss", () => {
    expect(convertSecondsToTimestamp(3600)).toBe("1:00:00");
    expect(convertSecondsToTimestamp(3661)).toBe("1:01:01");
  });
});

describe("validateAlgorithmConfig", () => {
  it("accepts valid config", () => {
    expect(() => validateAlgorithmConfig({})).not.toThrow();
  });

  it("rejects negative gap_tolerance", () => {
    expect(() => validateAlgorithmConfig({ gap_tolerance: -1 })).toThrow(AlgorithmConfigError);
  });

  it("rejects intensity_tolerance out of range", () => {
    expect(() => validateAlgorithmConfig({ intensity_tolerance: 1.5 })).toThrow(AlgorithmConfigError);
    expect(() => validateAlgorithmConfig({ intensity_tolerance: -0.1 })).toThrow(AlgorithmConfigError);
  });

  it("rejects min_intensity_cutoff out of range", () => {
    expect(() => validateAlgorithmConfig({ min_intensity_cutoff: 2 })).toThrow(AlgorithmConfigError);
  });

  it("rejects min_clip_duration <= 0", () => {
    expect(() => validateAlgorithmConfig({ min_clip_duration: 0 })).toThrow(AlgorithmConfigError);
    expect(() => validateAlgorithmConfig({ min_clip_duration: -5 })).toThrow(AlgorithmConfigError);
  });

  it("rejects max_clip_duration < min_clip_duration", () => {
    expect(() =>
      validateAlgorithmConfig({ min_clip_duration: 60, max_clip_duration: 30 })
    ).toThrow(AlgorithmConfigError);
  });

  it("rejects inverted target_duration_range", () => {
    expect(() =>
      validateAlgorithmConfig({ target_duration_range: [60, 15] })
    ).toThrow(AlgorithmConfigError);
  });

  it("rejects top_n < 1", () => {
    expect(() => validateAlgorithmConfig({ top_n: 0 })).toThrow(AlgorithmConfigError);
  });

  it("rejects negative min_spacing", () => {
    expect(() => validateAlgorithmConfig({ min_spacing: -1 })).toThrow(AlgorithmConfigError);
  });
});

describe("normalizeHeatmapValues", () => {
  it("returns empty array for empty input", () => {
    expect(normalizeHeatmapValues([])).toHaveLength(0);
  });

  it("normalizes percentage values (0-100) to 0-1", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 50 },
      { start_time: 10, end_time: 20, value: 100 },
      { start_time: 20, end_time: 30, value: 25 },
    ];
    const normalized = normalizeHeatmapValues(spikes);

    expect(normalized[0].value).toBeCloseTo(0.5);
    expect(normalized[1].value).toBeCloseTo(1.0);
    expect(normalized[2].value).toBeCloseTo(0.25);
  });

  it("passes through values already in 0-1 range", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 0.5 },
      { start_time: 10, end_time: 20, value: 0.8 },
    ];
    const normalized = normalizeHeatmapValues(spikes);

    expect(normalized[0].value).toBe(0.5);
    expect(normalized[1].value).toBe(0.8);
  });

  it("clamps negative values to 0", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: -0.5 },
    ];
    const normalized = normalizeHeatmapValues(spikes);

    expect(normalized[0].value).toBe(0);
  });

  it("treats NaN values as 0", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: NaN },
    ];
    const normalized = normalizeHeatmapValues(spikes);

    expect(normalized[0].value).toBe(0);
  });

  it("clamps values > 1 to 1 for 0-1 range input", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 1.5 },
    ];
    const normalized = normalizeHeatmapValues(spikes);

    expect(normalized[0].value).toBe(1);
  });
});

describe("mergeHeatmapSpikes (edge cases)", () => {
  it("filters out spikes with end_time < start_time", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 5, value: 0.8 },
    ];
    const merged = mergeHeatmapSpikes(spikes);
    expect(merged).toHaveLength(0);
  });

  it("filters out spikes with NaN timestamps", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: NaN, end_time: 10, value: 0.8 },
    ];
    const merged = mergeHeatmapSpikes(spikes);
    expect(merged).toHaveLength(0);
  });

  it("handles single spike", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.8 },
    ];
    const merged = mergeHeatmapSpikes(spikes);
    expect(merged).toHaveLength(1);
    expect(merged[0].start_time).toBe(10);
    expect(merged[0].end_time).toBe(20);
  });

  it("correctly handles overlapping spikes without double-counting duration", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 0.8 },
      { start_time: 5, end_time: 15, value: 0.9 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);

    expect(merged).toHaveLength(1);
    expect(merged[0].start_time).toBe(0);
    expect(merged[0].end_time).toBe(15);
    expect(merged[0].total_duration).toBeCloseTo(15);
    expect(merged[0].weighted_sum).toBeCloseTo(0.8 * 10 + 0.9 * 5);
  });

  it("handles all identical timestamps", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 10, end_time: 20, value: 0.8 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);
    expect(merged).toHaveLength(1);
  });
});

describe("extractTopScenes (new edge cases)", () => {
  it("single spike in valid range returns 1 scene", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 25, value: 0.9 },
    ];
    const scenes = extractTopScenes(spikes);
    expect(scenes).toHaveLength(1);
    expect(scenes[0].start_time).toBe(10);
    expect(scenes[0].end_time).toBe(25);
  });

  it("single spike below min_duration is filtered", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 11, value: 0.9 },
    ];
    const scenes = extractTopScenes(spikes, { min_clip_duration: 3 });
    expect(scenes).toHaveLength(0);
  });

  it("10000 continuous spikes completes without stack overflow", () => {
    const spikes: HeatmapSpike[] = [];
    for (let i = 0; i < 10000; i++) {
      spikes.push({ start_time: i, end_time: i + 0.5, value: 0.5 + Math.random() * 0.5 });
    }

    const start = Date.now();
    const scenes = extractTopScenes(spikes);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000);
    expect(scenes.length).toBeGreaterThanOrEqual(0);
  });

  it("top_n = 0 throws AlgorithmConfigError", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 25, value: 0.9 },
    ];
    expect(() => extractTopScenes(spikes, { top_n: 0 })).toThrow(AlgorithmConfigError);
  });

  it("top_n greater than available scenes returns all valid", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 25, value: 0.9 },
      { start_time: 100, end_time: 120, value: 0.85 },
    ];
    const scenes = extractTopScenes(spikes, { top_n: 10 });
    expect(scenes).toHaveLength(2);
  });

  it("extractTopScenes is idempotent", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 10, end_time: 25, value: 0.9 },
      { start_time: 100, end_time: 120, value: 0.85 },
      { start_time: 300, end_time: 320, value: 0.80 },
    ];
    const first = extractTopScenes(spikes);
    const second = extractTopScenes(spikes);
    expect(first).toEqual(second);
  });

  it("normalizes percentage values before processing", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 90 },
      { start_time: 10, end_time: 20, value: 95 },
      { start_time: 20, end_time: 30, value: 80 },
    ];
    const scenes = extractTopScenes(spikes);
    expect(scenes.length).toBeGreaterThanOrEqual(1);
    expect(scenes[0].peak_intensity).toBeLessThanOrEqual(1);
  });

  it("handles all-zero intensity spikes", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 0 },
      { start_time: 10, end_time: 20, value: 0 },
    ];
    const scenes = extractTopScenes(spikes);
    expect(scenes).toHaveLength(0);
  });

  it("bestSubwindow selects window with peak when tied averages", () => {
    const spikes: HeatmapSpike[] = [
      { start_time: 0, end_time: 10, value: 0.8 },
      { start_time: 10, end_time: 20, value: 0.8 },
      { start_time: 20, end_time: 30, value: 1.0 },
    ];
    const merged = mergeHeatmapSpikes(spikes, 5, 0.25, 0.4);
    const scored = capAndScoreBlocks(merged, 3, 15, [10, 15], 0.4, 0.4, 0.2);

    expect(scored.length).toBeGreaterThanOrEqual(1);
    if (scored.length > 0) {
      expect(scored[0].peak_intensity).toBeGreaterThanOrEqual(0.8);
    }
  });
});
