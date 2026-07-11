import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AppConfigModule } from "./infrastructure/config/config.module";
import { JobsModule } from "./presentation/jobs/jobs.module";

@Module({
  imports: [AppConfigModule, PrismaModule, HealthModule, JobsModule],
})
export class AppModule {}
