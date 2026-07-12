import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AppConfigModule } from "./infrastructure/config/config.module";
import { JobsModule } from "./presentation/jobs/jobs.module";
import { ClipsModule } from "./presentation/clips/clips.module";
import { StorageModule } from "./infrastructure/storage/storage.module";
import { AuthModule } from "./infrastructure/auth/auth.module";

@Module({
  imports: [AppConfigModule, PrismaModule, HealthModule, AuthModule, JobsModule, ClipsModule, StorageModule],
})
export class AppModule {}
