import { Provider, Global } from "@nestjs/common";

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
}

const SENTRY_CONFIG = "SENTRY_CONFIG";

@Global()
export class SentryModule {
  static forRoot(config: SentryConfig) {
    const provider: Provider = {
      provide: SENTRY_CONFIG,
      useValue: config,
    };

    return {
      module: SentryModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static async init(config: SentryConfig): Promise<void> {
    if (!config.dsn) return;

    try {
      const Sentry = await import("@sentry/nestjs");
      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        tracesSampleRate: config.tracesSampleRate,
      });
    } catch {
      console.warn("Sentry not available — error tracking disabled");
    }
  }
}
