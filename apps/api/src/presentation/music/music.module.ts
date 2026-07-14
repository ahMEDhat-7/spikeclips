import { Module } from "@nestjs/common";
import { MusicController } from "./music.controller";
import { MusicService } from "../../infrastructure/storage/music.service";
import { StorageModule } from "../../infrastructure/storage/storage.module";

@Module({
  imports: [StorageModule],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
