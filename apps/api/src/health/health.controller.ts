import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Health check", description: "Returns API status, timestamp, and uptime." })
  @ApiResponse({
    status: 200,
    description: "API is healthy",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2026-07-11T12:00:00.000Z" },
        uptime: { type: "number", example: 123.456 },
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}
