import {
  Controller,
  Get,
  Param,
  Res,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { ClipResponseDto } from "./dto/clip-response.dto";
import { STORAGE_SERVICE, StorageService } from "../../infrastructure/storage/storage.interface";

@ApiTags("Clips")
@Controller("clips")
export class ClipsController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService
  ) {}

  @Get("job/:jobId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List clips for a job",
    description: "Returns all clips (scenes) for a given job, ordered by scene index.",
  })
  @ApiParam({ name: "jobId", description: "Job UUID" })
  @ApiResponse({ status: 200, description: "List of clips", type: [ClipResponseDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findByJobId(@Param("jobId") jobId: string): Promise<ClipResponseDto[]> {
    const clips = await this.prisma.clip.findMany({
      where: { jobId },
      orderBy: { sceneIndex: "asc" },
    });

    return clips.map((clip) => ({
      id: clip.id,
      jobId: clip.jobId,
      sceneIndex: clip.sceneIndex,
      startTime: clip.startTime,
      endTime: clip.endTime,
      peakIntensity: clip.peakIntensity ?? undefined,
      status: clip.status,
      fileUrl: clip.fileUrl ?? undefined,
      fileSize: clip.fileSize ?? undefined,
      duration: clip.duration ?? undefined,
      errorMessage: clip.errorMessage ?? undefined,
      createdAt: clip.createdAt,
      completedAt: clip.completedAt ?? undefined,
    }));
  }

  @Get(":id/download")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Download a clip",
    description: "Returns a signed URL for downloading the clip file.",
  })
  @ApiParam({ name: "id", description: "Clip UUID" })
  @ApiResponse({ status: 200, description: "Redirects to signed download URL" })
  @ApiResponse({ status: 404, description: "Clip not found or not ready" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async download(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const clip = await this.prisma.clip.findUnique({ where: { id } });
    if (!clip) {
      throw new NotFoundException(`Clip ${id} not found`);
    }

    if (clip.status !== "completed" || !clip.fileUrl) {
      throw new NotFoundException(`Clip ${id} is not ready for download (status: ${clip.status})`);
    }

    const signedUrl = await this.storage.getSignedUrl(clip.fileUrl);
    res.redirect(signedUrl);
  }
}
