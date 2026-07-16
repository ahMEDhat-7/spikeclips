import { Clip } from "../clip.entity";

describe("Clip (e2e)", () => {
  const baseClip = {
    id: "clip-123",
    jobId: "job-456",
    sceneIndex: 0,
    startTime: 0,
    endTime: 5,
  };

  describe("getDuration", () => {
    it("calculates duration correctly", () => {
      const clip = new Clip(baseClip.id, baseClip.jobId, baseClip.sceneIndex, baseClip.startTime, baseClip.endTime);
      expect(clip.getDuration()).toBe(5);
    });

    it("handles zero duration", () => {
      const clip = new Clip("c1", "j1", 0, 10, 10);
      expect(clip.getDuration()).toBe(0);
    });

    it("handles large duration", () => {
      const clip = new Clip("c1", "j1", 0, 0, 300);
      expect(clip.getDuration()).toBe(300);
    });
  });

  describe("markCompleted", () => {
    it("marks clip as completed with file info", () => {
      const clip = new Clip("c1", "j1", 0, 0, 5);
      clip.markCompleted("/downloads/clip.mp4", 1024);
      expect(clip.status).toBe("completed");
      expect(clip.fileUrl).toBe("/downloads/clip.mp4");
      expect(clip.fileSize).toBe(1024);
      expect(clip.completedAt).toBeDefined();
    });

    it("sets duration on completion", () => {
      const clip = new Clip("c1", "j1", 0, 10, 20);
      clip.markCompleted("/file.mp4", 512);
      expect(clip.duration).toBe(10);
    });
  });

  describe("markFailed", () => {
    it("marks clip as failed with error message", () => {
      const clip = new Clip("c1", "j1", 0, 0, 5);
      clip.markFailed("FFmpeg encoding failed");
      expect(clip.status).toBe("failed");
      expect(clip.errorMessage).toBe("FFmpeg encoding failed");
    });
  });

  describe("status transitions", () => {
    it("starts with pending status", () => {
      const clip = new Clip("c1", "j1", 0, 0, 5);
      expect(clip.status).toBe("pending");
    });

    it("can transition from pending to processing", () => {
      const clip = new Clip("c1", "j1", 0, 0, 5);
      clip.status = "processing";
      expect(clip.status).toBe("processing");
    });

    it("can transition from processing to completed", () => {
      const clip = new Clip("c1", "j1", 0, 0, 5);
      clip.status = "processing";
      clip.markCompleted("/file.mp4", 1024);
      expect(clip.status).toBe("completed");
    });
  });
});
