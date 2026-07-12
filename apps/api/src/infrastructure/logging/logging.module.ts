import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { RequestLoggerMiddleware } from "./request-logger.middleware";

@Module({})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");
  }
}
