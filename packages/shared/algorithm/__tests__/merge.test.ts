import { extractTopScenes, convertSecondsToTimestamp } from "../merge";
import { HeatmapSpike } from "../types";

function printScenes(label: string, scenes: ReturnType<typeof extractTopScenes>) {
  console.log(`\n${label}`);
  scenes.forEach((s, i) => {
    console.log(
      `  Scene #${i + 1}: ${convertSecondsToTimestamp(s.start_time)}` +
        ` to ${convertSecondsToTimestamp(s.end_time)}` +
        ` (${s.duration.toFixed(0)}s) | peak=${s.peak_intensity.toFixed(2)}` +
        ` avg=${s.avg_intensity.toFixed(2)} score=${s.score.toFixed(3)}` +
        ` confidence=${s.confidence} capped=${s.capped}`
    );
  });
}

describe("extractTopScenes", () => {
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
    expect(scenes[0].peak_intensity).toBe(1.00);
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
