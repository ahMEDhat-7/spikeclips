import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { PrismaModule } from "../infrastructure/database/prisma.module";
import { StorageModule } from "../infrastructure/storage/storage.module";
import Redis from "ioredis";

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: () => {
    const host = process.env.REDIS_HOST || "localhost";
    const port = parseInt(process.env.REDIS_PORT || "6379");
    const password = process.env.REDIS_PASSWORD || undefined;
    return new Redis({ host, port, password, maxRetriesPerRequest: 3 });
  },
};

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [HealthController],
  providers: [HealthService, redisProvider],
  exports: [redisProvider],
})
export class HealthModule {}
