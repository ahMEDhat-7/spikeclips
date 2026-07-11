"""
SpikeClip — Canonical Heatmap Spike Merging Algorithm (v2)

Enhancements over v1 (which only did time-gap + intensity-delta + floor-override merging):

1. Composite scoring — blocks are ranked by a weighted mix of peak intensity, average
   intensity (area-under-curve / duration), and fit to an ideal short-form duration range,
   instead of peak intensity alone. A long block that merged in some mediocre segments
   no longer automatically beats a tighter, consistently strong block.

2. Duration constraints — min_clip_duration filters out slivers too short to be a usable
   clip; max_clip_duration caps blocks that grow too long for short-form by extracting the
   best-scoring sub-window (sliding window over the underlying raw spikes) rather than either
   truncating arbitrarily or shipping a 3-minute "short".

3. Merge confidence/provenance — each block records whether it merged purely on intensity
   similarity ("high" confidence) or needed the floor-override rule at any point
   ("floor_override") — useful for showing a confidence signal in the UI later.

4. Non-overlap + minimum spacing on the final top-N — greedy selection now skips candidates
   that overlap or sit too close to an already-selected scene, so the final picks are spread
   across the video instead of being 3 overlapping sub-ranges of one giant block.
"""

from __future__ import annotations
import json


def convert_seconds_to_timestamp(seconds: float) -> str:
    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    return f"{hours}:{minutes:02d}:{secs:02d}" if hours else f"{minutes}:{secs:02d}"


def merge_heatmap_spikes(
    raw_spikes,
    gap_tolerance: float = 5.0,
    intensity_tolerance: float = 0.25,
    min_intensity_cutoff: float = 0.40,
):
    """Step 1: chronological merge. Same merge RULE as the locked FR-3 spec
    (time gap AND (intensity delta within tolerance OR both segments above floor)),
    but now tracks weighted intensity, provenance, and underlying segments."""
    valid = [s for s in raw_spikes if "start_time" in s and "end_time" in s]
    if not valid:
        return []

    chronological = sorted(valid, key=lambda x: x["start_time"])
    blocks = []

    for seg in chronological:
        value = seg.get("value", 0.0)
        duration = max(seg["end_time"] - seg["start_time"], 0.0)

        if not blocks:
            blocks.append({
                "start_time": seg["start_time"],
                "end_time": seg["end_time"],
                "peak_intensity": value,
                "last_value": value,
                "weighted_sum": value * duration,
                "total_duration": duration,
                "used_floor_override": False,
                "segments": [seg],
            })
            continue

        prev = blocks[-1]
        time_gap_ok = seg["start_time"] <= prev["end_time"] + gap_tolerance
        delta = abs(value - prev["last_value"])
        intensity_ok = delta <= intensity_tolerance
        floor_ok = value >= min_intensity_cutoff and prev["last_value"] >= min_intensity_cutoff

        if time_gap_ok and (intensity_ok or floor_ok):
            prev["end_time"] = max(prev["end_time"], seg["end_time"])
            prev["peak_intensity"] = max(prev["peak_intensity"], value)
            prev["last_value"] = value
            prev["weighted_sum"] += value * duration
            prev["total_duration"] += duration
            prev["segments"].append(seg)
            if not intensity_ok and floor_ok:
                prev["used_floor_override"] = True
        else:
            blocks.append({
                "start_time": seg["start_time"],
                "end_time": seg["end_time"],
                "peak_intensity": value,
                "last_value": value,
                "weighted_sum": value * duration,
                "total_duration": duration,
                "used_floor_override": False,
                "segments": [seg],
            })

    return blocks


def _best_subwindow(segments, max_clip_duration: float):
    """Sliding window over a block's underlying segments to find the highest
    average-intensity sub-window whose span is <= max_clip_duration."""
    best = None
    left = 0
    window_weighted = 0.0
    window_duration = 0.0

    for right in range(len(segments)):
        seg = segments[right]
        seg_dur = seg["end_time"] - seg["start_time"]
        window_weighted += seg.get("value", 0.0) * seg_dur
        window_duration += seg_dur

        while segments[right]["end_time"] - segments[left]["start_time"] > max_clip_duration and left < right:
            lseg = segments[left]
            lseg_dur = lseg["end_time"] - lseg["start_time"]
            window_weighted -= lseg.get("value", 0.0) * lseg_dur
            window_duration -= lseg_dur
            left += 1

        span = segments[right]["end_time"] - segments[left]["start_time"]
        if span <= max_clip_duration and window_duration > 0:
            avg = window_weighted / window_duration
            peak = max(s.get("value", 0.0) for s in segments[left:right + 1])
            if best is None or avg > best["avg_intensity"]:
                best = {
                    "start_time": segments[left]["start_time"],
                    "end_time": segments[right]["end_time"],
                    "peak_intensity": peak,
                    "avg_intensity": avg,
                    "segments": segments[left:right + 1],
                }
    return best


def cap_and_score_blocks(
    merged_blocks,
    min_clip_duration: float = 3.0,
    max_clip_duration: float = 60.0,
    target_duration_range=(15.0, 60.0),
    weight_peak: float = 0.4,
    weight_avg: float = 0.4,
    weight_duration_fit: float = 0.2,
):
    """Step 2: apply duration limits and compute the composite score for each block."""
    lo, hi = target_duration_range
    results = []

    for block in merged_blocks:
        duration = block["end_time"] - block["start_time"]
        avg_intensity = (block["weighted_sum"] / block["total_duration"]) if block["total_duration"] else block["peak_intensity"]

        if duration > max_clip_duration:
            sub = _best_subwindow(block["segments"], max_clip_duration)
            if sub is None:
                continue
            start, end, peak, avg = sub["start_time"], sub["end_time"], sub["peak_intensity"], sub["avg_intensity"]
            capped = True
        else:
            start, end, peak, avg = block["start_time"], block["end_time"], block["peak_intensity"], avg_intensity
            capped = False

        final_duration = end - start
        if final_duration < min_clip_duration:
            continue

        if final_duration < lo:
            duration_fit = final_duration / lo
        elif final_duration > hi:
            duration_fit = max(0.0, 1 - (final_duration - hi) / hi)
        else:
            duration_fit = 1.0

        score = weight_peak * peak + weight_avg * avg + weight_duration_fit * duration_fit

        results.append({
            "start_time": start,
            "end_time": end,
            "duration": final_duration,
            "peak_intensity": peak,
            "avg_intensity": avg,
            "score": score,
            "confidence": "floor_override" if block["used_floor_override"] else "high",
            "capped": capped,
        })

    return results


def select_top_scenes(scored_blocks, top_n: int = 3, min_spacing: float = 5.0):
    """Step 3: greedy top-N selection that skips overlapping/too-close candidates,
    so picks are spread across the video rather than clustered in one region."""
    ranked = sorted(scored_blocks, key=lambda b: b["score"], reverse=True)
    selected = []

    for candidate in ranked:
        conflict = any(
            not (candidate["end_time"] + min_spacing <= s["start_time"]
                 or candidate["start_time"] - min_spacing >= s["end_time"])
            for s in selected
        )
        if not conflict:
            selected.append(candidate)
        if len(selected) >= top_n:
            break

    return sorted(selected, key=lambda b: b["start_time"])


def extract_top_scenes(
    raw_spikes,
    gap_tolerance: float = 5.0,
    intensity_tolerance: float = 0.25,
    min_intensity_cutoff: float = 0.40,
    min_clip_duration: float = 3.0,
    max_clip_duration: float = 60.0,
    target_duration_range=(15.0, 60.0),
    top_n: int = 3,
    min_spacing: float = 5.0,
    weight_peak: float = 0.4,
    weight_avg: float = 0.4,
    weight_duration_fit: float = 0.2,
):
    """Full pipeline: merge -> cap & score -> select top N."""
    merged = merge_heatmap_spikes(raw_spikes, gap_tolerance, intensity_tolerance, min_intensity_cutoff)
    scored = cap_and_score_blocks(
        merged, min_clip_duration, max_clip_duration, target_duration_range,
        weight_peak, weight_avg, weight_duration_fit,
    )
    return select_top_scenes(scored, top_n, min_spacing)


def _print_scenes(label, scenes):
    print(f"\n{label}")
    for i, s in enumerate(scenes, 1):
        print(
            f"  Scene #{i}: {convert_seconds_to_timestamp(s['start_time'])}"
            f" to {convert_seconds_to_timestamp(s['end_time'])}"
            f" ({s['duration']:.0f}s) | peak={s['peak_intensity']:.2f}"
            f" avg={s['avg_intensity']:.2f} score={s['score']:.3f}"
            f" confidence={s['confidence']} capped={s['capped']}"
        )


if __name__ == "__main__":
    # TC-VID-06: the original edge case — should still merge into one 100-124s block
    tc_vid_06 = [
        {"start_time": 100, "end_time": 108, "value": 0.60},
        {"start_time": 108, "end_time": 116, "value": 1.00},
        {"start_time": 116, "end_time": 124, "value": 0.73},
    ]
    _print_scenes("TC-VID-06 (should merge to 100-124, peak 1.00):", extract_top_scenes(tc_vid_06))

    # New case: a block that would naturally merge to ~90s — should get capped to <=60s
    # by keeping the best-scoring 60s sub-window rather than shipping the whole thing.
    long_block = [
        {"start_time": 0, "end_time": 15, "value": 0.45},
        {"start_time": 15, "end_time": 35, "value": 0.95},
        {"start_time": 35, "end_time": 55, "value": 0.98},
        {"start_time": 55, "end_time": 70, "value": 0.50},
        {"start_time": 70, "end_time": 90, "value": 0.42},
    ]
    _print_scenes("Long block (~90s) capped to best 60s sub-window:", extract_top_scenes(long_block, max_clip_duration=60))

    # New case: two strong, non-adjacent peaks plus a weak one in between —
    # top-3 selection should spread across the video, not cluster.
    spread_out = [
        {"start_time": 10, "end_time": 25, "value": 0.90},
        {"start_time": 200, "end_time": 218, "value": 0.85},
        {"start_time": 400, "end_time": 412, "value": 0.30},
        {"start_time": 600, "end_time": 630, "value": 0.97},
    ]
    _print_scenes("Spread-out peaks (diversity across timeline):", extract_top_scenes(spread_out, top_n=3))

    # New case: a sliver spike below min_clip_duration should be dropped
    sliver = [
        {"start_time": 50, "end_time": 51, "value": 0.99},
        {"start_time": 300, "end_time": 320, "value": 0.80},
    ]
    _print_scenes("Sliver spike filtered out by min_clip_duration:", extract_top_scenes(sliver, min_clip_duration=3.0))