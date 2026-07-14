import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { PrismaService } from "../database/prisma.service";
import * as bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{
    accessToken: string;
    userId: string;
    email: string;
    name: string;
    plan: string;
    analysesUsed: number;
    analysesLimit: number;
    scenesLimit: number;
  }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const userId = randomUUID();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        id: userId,
        email,
        passwordHash,
        name,
        plan: "free",
        analysesUsed: 0,
        analysesLimit: 3,
        scenesLimit: 3,
      },
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    this.logger.log(`User registered: ${user.email}`);

    return {
      accessToken,
      userId: user.id,
      email: user.email,
      name: user.name ?? "",
      plan: user.plan,
      analysesUsed: user.analysesUsed,
      analysesLimit: user.analysesLimit,
      scenesLimit: user.scenesLimit,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    userId: string;
    email: string;
    name: string;
    plan: string;
    analysesUsed: number;
    analysesLimit: number;
    scenesLimit: number;
  }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      userId: user.id,
      email: user.email,
      name: user.name ?? "",
      plan: user.plan,
      analysesUsed: user.analysesUsed,
      analysesLimit: user.analysesLimit,
      scenesLimit: user.scenesLimit,
    };
  }

  async getProfile(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    plan: string;
    analysesUsed: number;
    analysesLimit: number;
    scenesLimit: number;
    createdAt: Date;
  } | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? "",
      plan: user.plan,
      analysesUsed: user.analysesUsed,
      analysesLimit: user.analysesLimit,
      scenesLimit: user.scenesLimit,
      createdAt: user.createdAt,
    };
  }

  async incrementAnalyses(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { analysesUsed: { increment: 1 } },
    });
  }

  async checkCanAnalyze(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;
    if (user.plan === "pro" || user.plan === "team") return true;
    return user.analysesUsed < user.analysesLimit;
  }

  async updateProfile(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<{
    id: string;
    email: string;
    name: string;
    plan: string;
    analysesUsed: number;
    analysesLimit: number;
    scenesLimit: number;
    createdAt: Date;
  }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        throw new ConflictException("Email already in use");
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
      },
    });

    this.logger.log(`Profile updated for user: ${updated.email}`);

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name ?? "",
      plan: updated.plan,
      analysesUsed: updated.analysesUsed,
      analysesLimit: updated.analysesLimit,
      scenesLimit: updated.scenesLimit,
      createdAt: updated.createdAt,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    this.logger.log(`Password changed for user: ${user.email}`);
  }
}
