import { Clip } from "../entities/clip.entity";

export interface ClipRepository {
  findById(id: string): Promise<Clip | null>;
  findByJobId(jobId: string): Promise<Clip[]>;
  create(clip: Clip): Promise<Clip>;
  update(id: string, data: Partial<Clip>): Promise<Clip>;
}
