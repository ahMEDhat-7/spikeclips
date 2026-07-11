import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { CreateJobUseCase } from "../../application/use-cases/create-job.use-case";
import { ProcessHeatmapUseCase } from "../../application/use-cases/process-heatmap.use-case";
import { ExportClipsUseCase } from "../../application/use-cases/export-clips.use-case";
import { CreateJobDto } from "../../application/dto/create-job.dto";
import { ExportClipsDto } from "../../application/dto/export-clips.dto";
import { JobResponseDto } from "../../application/dto/job-response.dto";
import { JobRepository } from "../../domain/repositories/job.repository";
import { JobNotFoundException } from "../../domain/exceptions/job-not-found.exception";

@ApiTags("Jobs")
@Controller("jobs")
export class JobsController {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly processHeatmapUseCase: ProcessHeatmapUseCase,
    private readonly exportClipsUseCase: ExportClipsUseCase,
    private readonly jobRepository: JobRepository
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new analysis job", description: "Submits a YouTube URL for heatmap analysis. Extracts video metadata and queues the job for processing." })
  @ApiResponse({ status: 201, description: "Job created successfully", type: JobResponseDto })
  @ApiResponse({ status: 400, description: "Invalid YouTube URL" })
  async create(@Body() dto: CreateJobDto): Promise<JobResponseDto> {
    return this.createJobUseCase.execute(dto.url, dto.userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get job by ID", description: "Returns a single job with its current status, scenes, and heatmap data." })
  @ApiParam({ name: "id", description: "Job UUID", example: "550e8400-e29b-41d4-a716-446655440000" })
  @ApiResponse({ status: 200, description: "Job found", type: JobResponseDto })
  @ApiResponse({ status: 404, description: "Job not found" })
  async findOne(@Param("id") id: string): Promise<JobResponseDto> {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new JobNotFoundException(id);
    return JobResponseDto.fromEntity(job);
  }

  @Get()
  @ApiOperation({ summary: "List jobs for a user", description: "Returns all jobs for a given user, ordered by creation date descending." })
  @ApiQuery({ name: "userId", description: "User ID to filter jobs", example: "user-123" })
  @ApiResponse({ status: 200, description: "List of jobs", type: [JobResponseDto] })
  async findAll(@Query("userId") userId: string): Promise<JobResponseDto[]> {
    const jobs = await this.jobRepository.findByUserId(userId);
    return jobs.map(JobResponseDto.fromEntity);
  }

  @Post(":id/process")
  @ApiOperation({ summary: "Process job heatmap", description: "Runs the spike merging algorithm on the job's heatmap data. Generates scored scenes." })
  @ApiParam({ name: "id", description: "Job UUID" })
  @ApiResponse({ status: 200, description: "Job processed successfully", type: JobResponseDto })
  @ApiResponse({ status: 404, description: "Job not found" })
  async process(@Param("id") id: string): Promise<JobResponseDto> {
    return this.processHeatmapUseCase.execute(id);
  }

  @Post(":id/export")
  @ApiOperation({ summary: "Export clips from job", description: "Queues export jobs for selected scenes. Returns clip job IDs for tracking." })
  @ApiParam({ name: "id", description: "Job UUID" })
  @ApiResponse({
    status: 200,
    description: "Export jobs queued",
    schema: {
      type: "object",
      properties: {
        jobId: { type: "string", example: "550e8400-e29b-41d4-a716-446655440000" },
        clipJobIds: { type: "array", items: { type: "string" }, example: ["550e8400-...-0", "550e8400-...-2"] },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Job not found" })
  async export(
    @Param("id") id: string,
    @Body() dto: ExportClipsDto
  ): Promise<{ jobId: string; clipJobIds: string[] }> {
    return this.exportClipsUseCase.execute(id, dto.sceneIndices);
  }
}
