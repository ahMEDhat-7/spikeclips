import { isValidYoutubeUrl } from "../domain/entities/youtube-url";

describe("YoutubeUrl validation", () => {
  it("validates YouTube watch URLs", () => {
    expect(isValidYoutubeUrl("https://youtube.com/watch?v=abc")).toBe(true);
  });

  it("validates youtu.be URLs", () => {
    expect(isValidYoutubeUrl("https://youtu.be/abc")).toBe(true);
  });

  it("validates shorts URLs", () => {
    expect(isValidYoutubeUrl("https://youtube.com/shorts/abc")).toBe(true);
  });

  it("rejects non-YouTube URLs", () => {
    expect(isValidYoutubeUrl("https://vimeo.com/123")).toBe(false);
  });
});
