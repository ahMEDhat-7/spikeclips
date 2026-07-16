import { YoutubeUrl } from "../youtube-url";

describe("YoutubeUrl (e2e)", () => {
  describe("create", () => {
    it("creates a valid YoutubeUrl from standard URL", () => {
      const url = YoutubeUrl.create("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(url.toString()).toContain("youtube.com/watch");
    });

    it("creates a valid YoutubeUrl from short URL", () => {
      const url = YoutubeUrl.create("https://youtu.be/dQw4w9WgXcQ");
      expect(url.toString()).toContain("youtu.be");
    });

    it("creates a valid YoutubeUrl from embed URL", () => {
      const url = YoutubeUrl.create("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(url.toString()).toContain("youtube.com/embed");
    });

    it("creates a valid YoutubeUrl from mobile URL", () => {
      const url = YoutubeUrl.create("https://m.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(url.toString()).toContain("m.youtube.com");
    });

    it("creates a valid YoutubeUrl from shorts URL", () => {
      const url = YoutubeUrl.create("https://www.youtube.com/shorts/abc123");
      expect(url.toString()).toContain("youtube.com/shorts");
    });
  });

  describe("rejects invalid URLs", () => {
    it("rejects empty string", () => {
      expect(() => YoutubeUrl.create("")).toThrow("Invalid YouTube URL");
    });

    it("rejects whitespace only", () => {
      expect(() => YoutubeUrl.create("   ")).toThrow("Invalid YouTube URL");
    });

    it("rejects non-YouTube URL", () => {
      expect(() => YoutubeUrl.create("https://google.com")).toThrow("Invalid YouTube URL");
    });

    it("rejects Vimeo URL", () => {
      expect(() => YoutubeUrl.create("https://vimeo.com/123456")).toThrow("Invalid YouTube URL");
    });

    it("rejects malformed URL", () => {
      expect(() => YoutubeUrl.create("not-a-url")).toThrow("Invalid YouTube URL");
    });
  });

  describe("isValid", () => {
    it("returns true for valid YouTube URLs", () => {
      expect(YoutubeUrl.isValid("https://youtube.com/watch?v=abc")).toBe(true);
      expect(YoutubeUrl.isValid("https://youtu.be/abc")).toBe(true);
      expect(YoutubeUrl.isValid("https://www.youtube.com/embed/abc")).toBe(true);
      expect(YoutubeUrl.isValid("https://www.youtube.com/shorts/abc")).toBe(true);
    });

    it("returns false for invalid URLs", () => {
      expect(YoutubeUrl.isValid("")).toBe(false);
      expect(YoutubeUrl.isValid("https://google.com")).toBe(false);
      expect(YoutubeUrl.isValid("not-a-url")).toBe(false);
    });
  });

  describe("toString", () => {
    it("returns the original URL", () => {
      const url = YoutubeUrl.create("https://youtube.com/watch?v=abc");
      expect(url.toString()).toBe("https://youtube.com/watch?v=abc");
    });
  });
});
