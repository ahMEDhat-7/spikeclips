import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser = require("cookie-parser");
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./presentation/filters/exception.filter";
import { LoggingInterceptor } from "./presentation/interceptors/logging.interceptor";
import { startWorkers, stopWorkers } from "./infrastructure/workers";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  });

  const config = new DocumentBuilder()
    .setTitle("SpikeClip API")
    .setDescription(
      "YouTube heatmap-driven clip extraction API. " +
        "Analyze viewer engagement data to find the most-replayed moments in videos."
    )
    .setVersion("0.1.0")
    .addTag("Health", "API health checks")
    .addTag("Auth", "User authentication and registration")
    .addTag("Jobs", "Video analysis jobs — create, process, export clips")
    .addTag("Clips", "Clip download and management")
    .addTag("Music", "Background music upload and management")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);

  try {
    const { PrismaService } = await import("./infrastructure/database/prisma.service");
    const { FfmpegService } = await import("./infrastructure/external/ffmpeg.service");
    const prisma = app.get(PrismaService);
    const storage = app.get("STORAGE_SERVICE");
    const ffmpeg = new FfmpegService();
    startWorkers(prisma, storage, ffmpeg);
  } catch (err) {
    console.warn("Failed to start workers (Redis may be unavailable):", err instanceof Error ? err.message : err);
  }
}

process.on("SIGTERM", async () => {
  await stopWorkers();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await stopWorkers();
  process.exit(0);
});

bootstrap();
