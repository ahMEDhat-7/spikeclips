import { ConsoleLogger, LogLevel } from "@nestjs/common";

export class StructuredLogger extends ConsoleLogger {
  protected formatMessage(level: string, message: string, context?: string): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context,
      message,
    });
  }

  log(message: string, context?: string): void {
    console.log(this.formatMessage("info", message, context));
  }

  error(message: string, stack?: string, context?: string): void {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        context: context || this.context,
        message,
        stack,
      })
    );
  }

  warn(message: string, context?: string): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  debug(message: string, context?: string): void {
    console.debug(this.formatMessage("debug", message, context));
  }

  verbose(message: string, context?: string): void {
    console.trace(this.formatMessage("verbose", message, context));
  }
}
