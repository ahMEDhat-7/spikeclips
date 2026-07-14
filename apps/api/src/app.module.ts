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
import { MusicModule } from "./presentation/music/music.module";
import { ExternalModule } from "./infrastructure/external/external.module";
import { JwtAuthGuard } from "./infrastructure/auth/jwt-auth.guard";
import { RolesGuard } from "./infrastructure/auth/roles.guard";

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    JobsModule,
    ClipsModule,
    StorageModule,
    MusicModule,
    ExternalModule,
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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
