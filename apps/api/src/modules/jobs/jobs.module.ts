import { Module } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { PrismaService } from "../../prisma/prisma.service";
import { YtdlpService } from "../../services/ytdlp.service";
import { QueueService } from "../../services/queue.service";

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService, YtdlpService, QueueService],
  exports: [JobsService],
})
export class JobsModule {}
