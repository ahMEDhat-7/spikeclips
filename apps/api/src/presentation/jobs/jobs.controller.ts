import { Controller, Post, Get, Param, Body, Query } from "@nestjs/common";
import { CreateJobUseCase } from "../../application/use-cases/create-job.use-case";
import { ProcessHeatmapUseCase } from "../../application/use-cases/process-heatmap.use-case";
import { ExportClipsUseCase } from "../../application/use-cases/export-clips.use-case";
import { CreateJobDto } from "../../application/dto/create-job.dto";
import { ExportClipsDto } from "../../application/dto/export-clips.dto";
import { JobResponseDto } from "../../application/dto/job-response.dto";
import { JobRepository } from "../../domain/repositories/job.repository";
import { JobNotFoundException } from "../../domain/exceptions/job-not-found.exception";

@Controller("jobs")
export class JobsController {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly processHeatmapUseCase: ProcessHeatmapUseCase,
    private readonly exportClipsUseCase: ExportClipsUseCase,
    private readonly jobRepository: JobRepository
  ) {}

  @Post()
  async create(@Body() dto: CreateJobDto): Promise<JobResponseDto> {
    return this.createJobUseCase.execute(dto.url, dto.userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<JobResponseDto> {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new JobNotFoundException(id);
    return JobResponseDto.fromEntity(job);
  }

  @Get()
  async findAll(@Query("userId") userId: string): Promise<JobResponseDto[]> {
    const jobs = await this.jobRepository.findByUserId(userId);
    return jobs.map(JobResponseDto.fromEntity);
  }

  @Post(":id/process")
  async process(@Param("id") id: string): Promise<JobResponseDto> {
    return this.processHeatmapUseCase.execute(id);
  }

  @Post(":id/export")
  async export(
    @Param("id") id: string,
    @Body() dto: ExportClipsDto
  ): Promise<{ jobId: string; clipJobIds: string[] }> {
    return this.exportClipsUseCase.execute(id, dto.sceneIndices);
  }
}
