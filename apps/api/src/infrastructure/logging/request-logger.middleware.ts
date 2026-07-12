import { Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on("finish", () => {
      const elapsed = Date.now() - start;
      const { statusCode } = res;
      const log = `${method} ${originalUrl} ${statusCode} ${elapsed}ms`;

      if (statusCode >= 500) {
        this.logger.error(log);
      } else if (statusCode >= 400) {
        this.logger.warn(log);
      } else {
        this.logger.log(log);
      }
    });

    next();
  }
}
