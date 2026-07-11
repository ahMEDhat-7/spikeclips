export class InvalidUrlException extends Error {
  constructor(url: string) {
    super(`Invalid YouTube URL: ${url}`);
    this.name = "InvalidUrlException";
  }
}
