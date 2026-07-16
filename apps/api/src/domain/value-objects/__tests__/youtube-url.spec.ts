import { YoutubeUrl } from "../youtube-url";

describe("YoutubeUrl", () => {
  it("accepts standard watch?v= URL", () => {
    const url = YoutubeUrl.create("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(url.toString()).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("accepts youtu.be short URL", () => {
    const url = YoutubeUrl.create("https://youtu.be/dQw4w9WgXcQ");
    expect(url.toString()).toBe("https://youtu.be/dQw4w9WgXcQ");
  });

  it("accepts shorts URL", () => {
    const url = YoutubeUrl.create("https://www.youtube.com/shorts/dQw4w9WgXcQ");
    expect(url.toString()).toBe("https://www.youtube.com/shorts/dQw4w9WgXcQ");
  });

  it("accepts embed URL", () => {
    const url = YoutubeUrl.create("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(url.toString()).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("rejects non-YouTube URLs", () => {
    expect(() => YoutubeUrl.create("https://vimeo.com/123456")).toThrow("Invalid YouTube URL");
    expect(() => YoutubeUrl.create("https://google.com")).toThrow("Invalid YouTube URL");
  });

  it("rejects empty URLs", () => {
    expect(() => YoutubeUrl.create("")).toThrow("Invalid YouTube URL");
    expect(() => YoutubeUrl.create("   ")).toThrow("Invalid YouTube URL");
  });

  it("isValid returns true for valid URLs", () => {
    expect(YoutubeUrl.isValid("https://youtube.com/watch?v=abc")).toBe(true);
    expect(YoutubeUrl.isValid("https://youtu.be/abc")).toBe(true);
  });

  it("isValid returns false for invalid URLs", () => {
    expect(YoutubeUrl.isValid("https://vimeo.com/123")).toBe(false);
    expect(YoutubeUrl.isValid("not a url")).toBe(false);
  });
});
