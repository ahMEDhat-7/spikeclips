import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JobRepository } from "../../../domain/repositories/job.repository";
import { Job } from "../../../domain/entities/job.entity";
import { JobMapper } from "../../../application/mappers/job.mapper";
import { JobStatus } from "@spikeclip/shared";

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    return job ? JobMapper.toEntity(job) : null;
  }

  async findByUserId(userId: string): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return jobs.map(JobMapper.toEntity);
  }

  async create(job: Job): Promise<Job> {
    const data = JobMapper.toPersistence(job);
    const created = await this.prisma.job.create({ data });
    return JobMapper.toEntity(created);
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.scenes && { scenes: data.scenes }),
        ...(data.errorMessage && { errorMessage: data.errorMessage }),
        ...(data.completedAt && { completedAt: data.completedAt }),
      },
    });
    return JobMapper.toEntity(updated);
  }

  async updateStatus(id: string, status: JobStatus): Promise<void> {
    await this.prisma.job.update({
      where: { id },
      data: { status },
    });
  }
}
