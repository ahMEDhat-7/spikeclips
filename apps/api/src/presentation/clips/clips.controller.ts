import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  Inject,
  Logger,
  NotFoundException,
  ForbiddenException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { join, resolve } from "path";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { ClipResponseDto } from "./dto/clip-response.dto";
import { STORAGE_SERVICE, StorageService } from "../../infrastructure/storage/storage.interface";
import { LocalStorageService } from "../../infrastructure/storage/local-storage.service";
import { Roles } from "../../infrastructure/auth/roles.decorator";
import { Public } from "../../infrastructure/auth/jwt-auth.guard";

const CLIPS_DIR = process.env.CLIPS_DIR || "/tmp/spikeclips-clips";

@ApiTags("Clips")
@Controller("clips")
export class ClipsController {
  private readonly logger = new Logger(ClipsController.name);

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
  @ApiResponse({ status: 403, description: "Forbidden — job does not belong to you" })
  async findByJobId(
    @Param("jobId", ParseUUIDPipe) jobId: string,
    @Req() req: Request & { user?: { userId?: string } }
  ): Promise<ClipResponseDto[]> {
    const job = await this.prisma.job.findUnique({ where: { id: jobId }, select: { userId: true } });
    if (!job) throw new NotFoundException(`Job ${jobId} not found`);
    if (job.userId !== req.user?.userId) throw new ForbiddenException("Job does not belong to you");

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
  @Roles("pro", "team")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Download a clip",
    description: "Returns a signed URL for downloading the clip file.",
  })
  @ApiParam({ name: "id", description: "Clip UUID" })
  @ApiResponse({ status: 200, description: "Redirects to signed download URL" })
  @ApiResponse({ status: 404, description: "Clip not found or not ready" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Pro or Team plan required" })
  async download(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: Request & { user?: { userId?: string } },
    @Res() res: Response
  ): Promise<void> {
    const clip = await this.prisma.clip.findUnique({ where: { id } });
    if (!clip) {
      throw new NotFoundException(`Clip ${id} not found`);
    }

    const job = await this.prisma.job.findUnique({ where: { id: clip.jobId }, select: { userId: true } });
    if (!job || job.userId !== req.user?.userId) {
      throw new ForbiddenException("Clip does not belong to you");
    }

    if (clip.status !== "completed" || !clip.fileUrl) {
      throw new NotFoundException(`Clip ${id} is not ready for download (status: ${clip.status})`);
    }

    const signedUrl = await this.storage.getSignedUrl(clip.fileUrl);
    res.redirect(signedUrl);
  }

  @Get("download/:key")
  @Public()
  @ApiOperation({
    summary: "Serve a clip file via signed URL",
    description: "Downloads a clip file from local storage after verifying the signed URL.",
  })
  @ApiParam({ name: "key", description: "Storage key" })
  @ApiResponse({ status: 200, description: "Serves the file" })
  @ApiResponse({ status: 403, description: "Invalid or expired signature" })
  @ApiResponse({ status: 404, description: "File not found" })
  async downloadFile(
    @Param("key") key: string,
    @Query("expires") expires: string,
    @Query("sig") sig: string,
    @Res() res: Response
  ): Promise<void> {
    const expiresNum = parseInt(expires, 10);
    if (!expiresNum || !sig) {
      throw new ForbiddenException("Missing signature parameters");
    }

    if (!LocalStorageService.verifySignature(key, expiresNum, sig)) {
      throw new ForbiddenException("Invalid or expired signature");
    }

    const filePath = join(CLIPS_DIR, key);
    const resolved = resolve(filePath);
    if (!resolved.startsWith(resolve(CLIPS_DIR))) {
      throw new ForbiddenException("Invalid file path");
    }

    try {
      const fileStat = await stat(resolved);
      const ext = resolved.split(".").pop()?.toLowerCase() || "mp4";
      const contentType = ext === "webm" ? "video/webm" : "video/mp4";
      res.set({
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `attachment; filename="${key.split("/").pop()?.replace(/[^a-zA-Z0-9._-]/g, "_") || `clip.${ext}`}"`,
      });
      createReadStream(resolved)
        .on("error", (err) => {
          this.logger.error(`Stream error reading ${key}: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to read clip file" });
          }
        })
        .pipe(res);
    } catch {
      throw new NotFoundException("File not found");
    }
  }
}
