import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { PrismaService } from "../database/prisma.service";

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
  }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const userId = randomUUID();
    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        plan: "free",
        analysesUsed: 0,
        analysesLimit: 3,
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
  }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
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
    };
  }

  async getProfile(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    plan: string;
    analysesUsed: number;
    analysesLimit: number;
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

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import("bcrypt");
    return bcrypt.hash(password, 12);
  }
}
