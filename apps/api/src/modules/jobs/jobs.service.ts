import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { YtdlpService } from "../../services/ytdlp.service";
import { QueueService } from "../../services/queue.service";
import { mergeHeatmapSpikes, capAndScoreBlocks, selectTopScenes } from "@spikeclip/shared";

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ytdlp: YtdlpService,
    private readonly queue: QueueService
  ) {}

  async create(data: { url: string; userId: string }) {
    this.logger.log(`Creating job for URL: ${data.url}`);

    const videoMeta = await this.ytdlp.extractMetadata(data.url);

    const job = await this.prisma.job.create({
      data: {
        userId: data.userId,
        url: data.url,
        videoTitle: videoMeta.title,
        videoThumbnail: videoMeta.thumbnail,
        videoDuration: videoMeta.duration,
        status: "pending",
        heatmapData: videoMeta.heatmap,
      },
    });

    await this.queue.addAnalysisJob(job.id, {
      url: data.url,
      userId: data.userId,
    });

    return job;
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async findAll(userId: string) {
    return this.prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async processHeatmap(jobId: string) {
    this.logger.log(`Processing heatmap for job ${jobId}`);

    const job = await this.findOne(jobId);

    await this.prisma.job.update({
      where: { id: jobId },
      data: { status: "processing" },
    });

    try {
      const heatmap = job.heatmapData as any[];
      const duration = job.videoDuration || 0;

      const merged = mergeHeatmapSpikes(heatmap, 5, 0.25);
      const scored = capAndScoreBlocks(merged, 3, 60, 0.4);
      const selected = selectTopScenes(scored, 5, 8);

      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status: "completed",
          scenes: selected as any,
          completedAt: new Date(),
        },
      });

      return selected;
    } catch (error) {
      await this.prisma.job.update({
        where: { id: jobId },
        data: {
          status: "failed",
          errorMessage: error.message,
        },
      });
      throw error;
    }
  }

  async processClips(jobId: string, sceneIndices: number[]) {
    this.logger.log(`Processing clips for job ${jobId}: ${sceneIndices}`);

    const job = await this.findOne(jobId);
    const scenes = job.scenes as any[];

    const clipJobs = [];
    for (const idx of sceneIndices) {
      if (scenes[idx]) {
        await this.queue.addExportJob(jobId, {
          clipId: `${jobId}-${idx}`,
          sceneIndex: idx,
        });
        clipJobs.push(`${jobId}-${idx}`);
      }
    }

    return { jobId, clipJobIds: clipJobs };
  }
}
