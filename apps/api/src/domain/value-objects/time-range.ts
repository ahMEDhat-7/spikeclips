export class TimeRange {
  constructor(
    public readonly start: number,
    public readonly end: number
  ) {
    if (start < 0) throw new Error("Start time cannot be negative");
    if (end < start) throw new Error("End time must be after start time");
  }

  getDuration(): number {
    return this.end - this.start;
  }

  overlaps(other: TimeRange): boolean {
    return this.start < other.end && other.start < this.end;
  }

  contains(time: number): boolean {
    return time >= this.start && time <= this.end;
  }
}
