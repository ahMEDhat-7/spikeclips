import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { PlanTier } from "@spikeclip/shared";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.name ?? undefined,
      user.plan as PlanTier,
      user.stripeCustomerId ?? undefined,
      user.analysesUsed,
      user.analysesLimit,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.name ?? undefined,
      user.plan as PlanTier,
      user.stripeCustomerId ?? undefined,
      user.analysesUsed,
      user.analysesLimit,
      user.createdAt,
      user.updatedAt
    );
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
        analysesUsed: user.analysesUsed,
        analysesLimit: user.analysesLimit,
      },
    });

    return new User(
      created.id,
      created.email,
      created.name ?? undefined,
      created.plan as PlanTier,
      created.stripeCustomerId ?? undefined,
      created.analysesUsed,
      created.analysesLimit,
      created.createdAt,
      created.updatedAt
    );
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
      },
    });

    return new User(
      updated.id,
      updated.email,
      updated.name ?? undefined,
      updated.plan as PlanTier,
      updated.stripeCustomerId ?? undefined,
      updated.analysesUsed,
      updated.analysesLimit,
      updated.createdAt,
      updated.updatedAt
    );
  }
}
