import { Clip } from "../clip.entity";

describe("Clip", () => {
  it("creates a clip with defaults", () => {
    const clip = new Clip("clip-1", "job-1", 0, 10, 25);
    expect(clip.status).toBe("pending");
    expect(clip.getDuration()).toBe(15);
  });

  it("markCompleted sets status and file info", () => {
    const clip = new Clip("clip-1", "job-1", 0, 10, 25);
    clip.markCompleted("/tmp/clip.mp4", 1024);
    expect(clip.status).toBe("completed");
    expect(clip.fileUrl).toBe("/tmp/clip.mp4");
    expect(clip.fileSize).toBe(1024);
    expect(clip.duration).toBe(15);
    expect(clip.completedAt).toBeInstanceOf(Date);
  });

  it("markFailed sets status and error", () => {
    const clip = new Clip("clip-1", "job-1", 0, 10, 25);
    clip.markFailed("download failed");
    expect(clip.status).toBe("failed");
    expect(clip.errorMessage).toBe("download failed");
  });
});
