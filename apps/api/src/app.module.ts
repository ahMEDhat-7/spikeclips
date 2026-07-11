import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { ClipsModule } from "./modules/clips/clips.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    HealthModule,
    AuthModule,
    JobsModule,
    ClipsModule,
    UsersModule,
  ],
})
export class AppModule {}
