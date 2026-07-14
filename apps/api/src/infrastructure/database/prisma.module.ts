import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { USER_REPOSITORY } from "../../domain/repositories/user.repository";
import { PrismaUserRepository } from "./repositories/prisma-user.repository";

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, USER_REPOSITORY],
})
export class PrismaModule {}
