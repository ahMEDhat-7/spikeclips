import { Job } from "../job.entity";

describe("Job", () => {
  it("creates a job with defaults", () => {
    const job = new Job("job-1", "user-1", "https://youtube.com/watch?v=abc");
    expect(job.status).toBe("pending");
    expect(job.scenes).toBeUndefined();
    expect(job.heatmapData).toBeUndefined();
  });

  it("canProcess returns true for pending", () => {
    const job = new Job("job-1", "user-1", "url", undefined, undefined, undefined, "pending");
    expect(job.canProcess()).toBe(true);
  });

  it("canProcess returns true for processing", () => {
    const job = new Job("job-1", "user-1", "url", undefined, undefined, undefined, "processing");
    expect(job.canProcess()).toBe(true);
  });

  it("canProcess returns false for completed", () => {
    const job = new Job("job-1", "user-1", "url", undefined, undefined, undefined, "completed");
    expect(job.canProcess()).toBe(false);
  });

  it("markProcessing sets status", () => {
    const job = new Job("job-1", "user-1", "url");
    job.markProcessing();
    expect(job.status).toBe("processing");
  });

  it("markCompleted sets status and scenes", () => {
    const job = new Job("job-1", "user-1", "url");
    const scenes = [{ start_time: 0, end_time: 10, duration: 10, peak_intensity: 0.9, avg_intensity: 0.8, score: 0.85, confidence: "high" as const, capped: false }];
    job.markCompleted(scenes);
    expect(job.status).toBe("completed");
    expect(job.scenes).toEqual(scenes);
    expect(job.completedAt).toBeInstanceOf(Date);
  });

  it("markFailed sets status and error", () => {
    const job = new Job("job-1", "user-1", "url");
    job.markFailed("something broke");
    expect(job.status).toBe("failed");
    expect(job.errorMessage).toBe("something broke");
  });

  it("hasHeatmapData returns true when data exists", () => {
    const job = new Job("job-1", "user-1", "url", undefined, undefined, undefined, "pending", undefined, [{ start_time: 0, end_time: 10, value: 0.5 }]);
    expect(job.hasHeatmapData()).toBe(true);
  });

  it("hasHeatmapData returns false when no data", () => {
    const job = new Job("job-1", "user-1", "url");
    expect(job.hasHeatmapData()).toBe(false);
  });
});
