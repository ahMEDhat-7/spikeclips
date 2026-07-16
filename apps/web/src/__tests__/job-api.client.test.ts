import "@testing-library/jest-dom";
import { jobApi } from "../infrastructure/api/job-api.client";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("jobApi", () => {
  describe("createJob", () => {
    it("sends POST request with URL", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "job-1",
          userId: "user-1",
          url: "https://youtube.com/watch?v=abc",
          status: "pending",
          createdAt: "2026-01-01T00:00:00Z",
        }),
      });

      const result = await jobApi.createJob("https://youtube.com/watch?v=abc");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/jobs"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ url: "https://youtube.com/watch?v=abc" }),
        })
      );
      expect(result.id).toBe("job-1");
    });
  });

  describe("getJob", () => {
    it("sends GET request with job ID", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "job-1",
          status: "completed",
          scenes: [],
        }),
      });

      const result = await jobApi.getJob("job-1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/jobs/job-1"),
        expect.objectContaining({ credentials: "include" })
      );
      expect(result.status).toBe("completed");
    });
  });

  describe("processJob", () => {
    it("sends POST request to process endpoint", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "job-1",
          status: "completed",
          scenes: [{ start_time: 0, end_time: 10 }],
        }),
      });

      const result = await jobApi.processJob("job-1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/jobs/job-1/process"),
        expect.objectContaining({ method: "POST" })
      );
      expect(result.status).toBe("completed");
    });
  });

  describe("exportClips", () => {
    it("sends POST request with scene data", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          jobId: "job-1",
          clipJobIds: ["clip-1", "clip-2"],
        }),
      });

      const scenes = [
        { start_time: 0, end_time: 10, peak_intensity: 0.8 },
        { start_time: 15, end_time: 25, peak_intensity: 0.9 },
      ];

      const result = await jobApi.exportClips("job-1", scenes, {
        platform: "youtube-shorts",
        format: "mp4",
        quality: "1080p",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/jobs/job-1/export"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ scenes, platform: "youtube-shorts", format: "mp4", quality: "1080p" }),
        })
      );
      expect(result.clipJobIds).toHaveLength(2);
    });
  });

  describe("getClips", () => {
    it("sends GET request for job clips", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "clip-1", status: "completed" },
          { id: "clip-2", status: "processing" },
        ],
      });

      const result = await jobApi.getClips("job-1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/clips/job/job-1"),
        expect.objectContaining({ credentials: "include" })
      );
      expect(result).toHaveLength(2);
    });
  });
});
