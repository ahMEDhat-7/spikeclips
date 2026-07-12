import { Module } from "@nestjs/common";
import { ClipsController } from "./clips.controller";
import { StorageModule } from "../../infrastructure/storage/storage.module";

@Module({
  imports: [StorageModule],
  controllers: [ClipsController],
})
export class ClipsModule {}
