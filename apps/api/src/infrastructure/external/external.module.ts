import { Module } from "@nestjs/common";
import { FfmpegService } from "./ffmpeg.service";
import { BullMQQueueService } from "./queue.service";
import { YtdlpService } from "./ytdlp.service";
import { QUEUE_SERVICE } from "../../domain/services/queue";

export const FFMPEG_SERVICE = "FFMPEG_SERVICE";

@Module({
  providers: [
    { provide: FFMPEG_SERVICE, useClass: FfmpegService },
    { provide: QUEUE_SERVICE, useClass: BullMQQueueService },
    YtdlpService,
  ],
  exports: [FFMPEG_SERVICE, QUEUE_SERVICE, YtdlpService],
})
export class ExternalModule {}
