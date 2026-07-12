import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./infrastructure/database/prisma.module";
import { AppConfigModule } from "./infrastructure/config/config.module";
import { JobsModule } from "./presentation/jobs/jobs.module";
import { ClipsModule } from "./presentation/clips/clips.module";
import { StorageModule } from "./infrastructure/storage/storage.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { JwtAuthGuard } from "./infrastructure/auth/jwt-auth.guard";

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    JobsModule,
    ClipsModule,
    StorageModule,
    ThrottlerModule.forRoot([
      {
        name: "global",
        ttl: 60_000,
        limit: 30,
      },
      {
        name: "auth",
        ttl: 60_000,
        limit: 5,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
