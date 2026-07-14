import { PlanTier } from "@spikeclips/shared";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public name?: string,
    public plan: PlanTier = "free",
    public stripeCustomerId?: string,
    public analysesUsed: number = 0,
    public analysesLimit: number = 3,
    public scenesLimit: number = 3,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  canAnalyze(): boolean {
    return this.analysesUsed < this.analysesLimit;
  }

  incrementUsage(): void {
    this.analysesUsed += 1;
    this.updatedAt = new Date();
  }
}
