import { formatTime } from "@/lib/format";

describe("formatTime", () => {
  it("formats seconds to mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(90)).toBe("1:30");
    expect(formatTime(3600)).toBe("60:00");
  });

  it("handles fractional seconds by flooring", () => {
    expect(formatTime(65.7)).toBe("1:05");
  });

  it("handles zero", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("handles large values", () => {
    expect(formatTime(7261)).toBe("121:01");
  });
});
