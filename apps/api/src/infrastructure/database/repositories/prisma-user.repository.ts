import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { PlanTier } from "@spikeclips/shared";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(user: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    stripeCustomerId: string | null;
    analysesUsed: number;
    analysesLimit: number;
    scenesLimit: number;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      user.id,
      user.email,
      user.name ?? undefined,
      user.plan as PlanTier,
      user.stripeCustomerId ?? undefined,
      user.analysesUsed,
      user.analysesLimit,
      user.scenesLimit,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async create(user: User, passwordHash?: string): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: passwordHash ?? "",
        name: user.name,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
        analysesUsed: user.analysesUsed,
        analysesLimit: user.analysesLimit,
        scenesLimit: user.scenesLimit,
      },
    });

    return this.toEntity(created);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.plan && { plan: data.plan }),
        ...(data.stripeCustomerId && { stripeCustomerId: data.stripeCustomerId }),
        ...(data.analysesUsed !== undefined && { analysesUsed: data.analysesUsed }),
        ...(data.analysesLimit !== undefined && { analysesLimit: data.analysesLimit }),
        ...(data.scenesLimit !== undefined && { scenesLimit: data.scenesLimit }),
      },
    });

    return this.toEntity(updated);
  }
}
