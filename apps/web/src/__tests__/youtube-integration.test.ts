import { extractVideoId } from "@/lib/youtube";

describe("extractVideoId", () => {
  it("extracts from standard URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts from short URL", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts from embed URL", () => {
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts from shorts URL", () => {
    expect(extractVideoId("https://www.youtube.com/shorts/abc123")).toBe("abc123");
  });

  it("extracts from URL with extra params", () => {
    expect(extractVideoId("https://youtube.com/watch?v=abc&list=PL123")).toBe("abc");
  });

  it("returns null for non-YouTube URL", () => {
    expect(extractVideoId("https://google.com")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractVideoId("")).toBeNull();
  });

  it("returns null for malformed URL", () => {
    expect(extractVideoId("not-a-url")).toBeNull();
  });
});
