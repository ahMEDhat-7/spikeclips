import { Injectable } from "@nestjs/common";

@Injectable()
export class JobsService {
  async create(data: { url: string }) {
    // TODO: Implement job creation with Prisma
    return { id: "placeholder", status: "pending", url: data.url };
  }

  async findOne(id: string) {
    // TODO: Implement job lookup with Prisma
    return { id, status: "completed" };
  }

  async findAll() {
    // TODO: Implement job listing with Prisma
    return [];
  }

  async process(id: string, data: { sceneIds: string[] }) {
    // TODO: Implement clip processing
    return { jobId: id, clipJobIds: [] };
  }
}
