import { HeatmapSpike, MergedBlock, ScoredBlock, AlgorithmConfig, DEFAULT_ALGORITHM_CONFIG as DEFAULT_CONFIG } from "../types";

export function convertSecondsToTimestamp(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function mergeHeatmapSpikes(
  rawSpikes: HeatmapSpike[],
  gapTolerance: number = DEFAULT_CONFIG.gap_tolerance,
  intensityTolerance: number = DEFAULT_CONFIG.intensity_tolerance,
  minIntensityCutoff: number = DEFAULT_CONFIG.min_intensity_cutoff
): MergedBlock[] {
  const valid = rawSpikes.filter((s) => "start_time" in s && "end_time" in s);
  if (!valid.length) return [];

  const chronological = [...valid].sort((a, b) => a.start_time - b.start_time);
  const blocks: MergedBlock[] = [];

  for (const seg of chronological) {
    const value = seg.value ?? 0.0;
    const duration = Math.max(seg.end_time - seg.start_time, 0.0);

    if (!blocks.length) {
      blocks.push({
        start_time: seg.start_time,
        end_time: seg.end_time,
        peak_intensity: value,
        last_value: value,
        weighted_sum: value * duration,
        total_duration: duration,
        used_floor_override: false,
        segments: [seg],
      });
      continue;
    }

    const prev = blocks[blocks.length - 1];
    const timeGapOk = seg.start_time <= prev.end_time + gapTolerance;
    const delta = Math.abs(value - prev.last_value);
    const intensityOk = delta <= intensityTolerance;
    const floorOk = value >= minIntensityCutoff && prev.last_value >= minIntensityCutoff;

    if (timeGapOk && (intensityOk || floorOk)) {
      prev.end_time = Math.max(prev.end_time, seg.end_time);
      prev.peak_intensity = Math.max(prev.peak_intensity, value);
      prev.last_value = value;
      prev.weighted_sum += value * duration;
      prev.total_duration += duration;
      prev.segments.push(seg);
      if (!intensityOk && floorOk) {
        prev.used_floor_override = true;
      }
    } else {
      blocks.push({
        start_time: seg.start_time,
        end_time: seg.end_time,
        peak_intensity: value,
        last_value: value,
        weighted_sum: value * duration,
        total_duration: duration,
        used_floor_override: false,
        segments: [seg],
      });
    }
  }

  return blocks;
}

function bestSubwindow(
  segments: HeatmapSpike[],
  maxClipDuration: number
): { start_time: number; end_time: number; peak_intensity: number; avg_intensity: number; segments: HeatmapSpike[] } | null {
  let best: { start_time: number; end_time: number; peak_intensity: number; avg_intensity: number; segments: HeatmapSpike[] } | null = null;
  let left = 0;
  let windowWeighted = 0.0;
  let windowDuration = 0.0;

  for (let right = 0; right < segments.length; right++) {
    const seg = segments[right];
    const segDur = seg.end_time - seg.start_time;
    windowWeighted += (seg.value ?? 0.0) * segDur;
    windowDuration += segDur;

    while (
      segments[right].end_time - segments[left].start_time > maxClipDuration &&
      left < right
    ) {
      const lseg = segments[left];
      const lsegDur = lseg.end_time - lseg.start_time;
      windowWeighted -= (lseg.value ?? 0.0) * lsegDur;
      windowDuration -= lsegDur;
      left++;
    }

    const span = segments[right].end_time - segments[left].start_time;
    if (span <= maxClipDuration && windowDuration > 0) {
      const avg = windowWeighted / windowDuration;
      const peak = Math.max(...segments.slice(left, right + 1).map((s) => s.value ?? 0.0));
      if (!best || avg > best.avg_intensity) {
        best = {
          start_time: segments[left].start_time,
          end_time: segments[right].end_time,
          peak_intensity: peak,
          avg_intensity: avg,
          segments: segments.slice(left, right + 1),
        };
      }
    }
  }

  return best;
}

export function capAndScoreBlocks(
  mergedBlocks: MergedBlock[],
  minClipDuration: number = DEFAULT_CONFIG.min_clip_duration,
  maxClipDuration: number = DEFAULT_CONFIG.max_clip_duration,
  targetDurationRange: [number, number] = DEFAULT_CONFIG.target_duration_range,
  weightPeak: number = DEFAULT_CONFIG.weight_peak,
  weightAvg: number = DEFAULT_CONFIG.weight_avg,
  weightDurationFit: number = DEFAULT_CONFIG.weight_duration_fit
): ScoredBlock[] {
  const [lo, hi] = targetDurationRange;
  const results: ScoredBlock[] = [];

  for (const block of mergedBlocks) {
    const duration = block.end_time - block.start_time;
    const avgIntensity = block.total_duration
      ? block.weighted_sum / block.total_duration
      : block.peak_intensity;

    let start: number;
    let end: number;
    let peak: number;
    let avg: number;
    let capped: boolean;

    if (duration > maxClipDuration) {
      const sub = bestSubwindow(block.segments, maxClipDuration);
      if (!sub) continue;
      start = sub.start_time;
      end = sub.end_time;
      peak = sub.peak_intensity;
      avg = sub.avg_intensity;
      capped = true;
    } else {
      start = block.start_time;
      end = block.end_time;
      peak = block.peak_intensity;
      avg = avgIntensity;
      capped = false;
    }

    const finalDuration = end - start;
    if (finalDuration < minClipDuration) continue;

    let durationFit: number;
    if (finalDuration < lo) {
      durationFit = finalDuration / lo;
    } else if (finalDuration > hi) {
      durationFit = Math.max(0.0, 1 - (finalDuration - hi) / hi);
    } else {
      durationFit = 1.0;
    }

    const score = weightPeak * peak + weightAvg * avg + weightDurationFit * durationFit;

    results.push({
      start_time: start,
      end_time: end,
      duration: finalDuration,
      peak_intensity: peak,
      avg_intensity: avg,
      score,
      confidence: block.used_floor_override ? "floor_override" : "high",
      capped,
    });
  }

  return results;
}

export function selectTopScenes(
  scoredBlocks: ScoredBlock[],
  topN: number = DEFAULT_CONFIG.top_n,
  minSpacing: number = DEFAULT_CONFIG.min_spacing
): ScoredBlock[] {
  const ranked = [...scoredBlocks].sort((a, b) => b.score - a.score);
  const selected: ScoredBlock[] = [];

  for (const candidate of ranked) {
    const conflict = selected.some(
      (s) =>
        !(
          candidate.end_time + minSpacing <= s.start_time ||
          candidate.start_time - minSpacing >= s.end_time
        )
    );
    if (!conflict) {
      selected.push(candidate);
    }
    if (selected.length >= topN) break;
  }

  return [...selected].sort((a, b) => a.start_time - b.start_time);
}

export function extractTopScenes(
  rawSpikes: HeatmapSpike[],
  config: Partial<AlgorithmConfig> = {}
): ScoredBlock[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const merged = mergeHeatmapSpikes(
    rawSpikes,
    cfg.gap_tolerance,
    cfg.intensity_tolerance,
    cfg.min_intensity_cutoff
  );

  const scored = capAndScoreBlocks(
    merged,
    cfg.min_clip_duration,
    cfg.max_clip_duration,
    cfg.target_duration_range,
    cfg.weight_peak,
    cfg.weight_avg,
    cfg.weight_duration_fit
  );

  return selectTopScenes(scored, cfg.top_n, cfg.min_spacing);
}
