import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: { url: string }) {
    return this.jobsService.create(body);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Post(":id/process")
  process(@Param("id") id: string, @Body() body: { sceneIds: string[] }) {
    return this.jobsService.process(id, body);
  }
}
