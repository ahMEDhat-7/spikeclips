import { Module } from "@nestjs/common";
import { ClipsController } from "./clips.controller";
import { StorageModule } from "../../infrastructure/storage/storage.module";
import { PrismaModule } from "../../infrastructure/database/prisma.module";
import { CLIP_REPOSITORY } from "../../domain/repositories/clip.repository";
import { PrismaClipRepository } from "../../infrastructure/database/repositories/prisma-clip.repository";

@Module({
  imports: [StorageModule, PrismaModule],
  controllers: [ClipsController],
  providers: [
    {
      provide: CLIP_REPOSITORY,
      useClass: PrismaClipRepository,
    },
  ],
  exports: [CLIP_REPOSITORY],
})
export class ClipsModule {}
