import { InvalidUrlException } from "../exceptions/invalid-url.exception";

export class YoutubeUrl {
  private static readonly PATTERNS = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&?#]+)/,
  ];

  private constructor(private readonly value: string) {}

  static create(url: string): YoutubeUrl {
    if (!url || url.trim().length === 0) {
      throw new InvalidUrlException(url || "");
    }

    const isValid = YoutubeUrl.PATTERNS.some((p) => p.test(url));
    if (!isValid) {
      throw new InvalidUrlException(url);
    }

    return new YoutubeUrl(url);
  }

  static isValid(url: string): boolean {
    return YoutubeUrl.PATTERNS.some((p) => p.test(url));
  }

  toString(): string {
    return this.value;
  }
}
