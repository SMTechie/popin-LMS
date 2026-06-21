import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return { status: "ok", ts: new Date().toISOString() };
  }

  @Get("metrics")
  metrics() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }
}
