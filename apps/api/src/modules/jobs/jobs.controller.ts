import { Controller, Post, Get, Param, Body, Query } from "@nestjs/common";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: { url: string; userId: string }) {
    return this.jobsService.create(body);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Get()
  findAll(@Query("userId") userId: string) {
    return this.jobsService.findAll(userId);
  }

  @Post(":id/process")
  process(@Param("id") id: string) {
    return this.jobsService.processHeatmap(id);
  }

  @Post(":id/export")
  export(
    @Param("id") id: string,
    @Body() body: { sceneIndices: number[] }
  ) {
    return this.jobsService.processClips(id, body.sceneIndices);
  }
}
