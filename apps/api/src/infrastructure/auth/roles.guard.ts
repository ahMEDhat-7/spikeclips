import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      throw new ForbiddenException("Authentication required");
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { plan: true },
    });

    if (!dbUser) {
      throw new ForbiddenException("User not found");
    }

    if (!requiredRoles.includes(dbUser.plan)) {
      throw new ForbiddenException(
        `This feature requires a ${requiredRoles.join(" or ")} plan. Upgrade your account to access this.`
      );
    }

    return true;
  }
}
