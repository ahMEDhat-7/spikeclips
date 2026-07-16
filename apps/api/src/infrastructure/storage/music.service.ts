import { Injectable, Logger, Inject } from "@nestjs/common";
import { STORAGE_SERVICE, StorageService } from "./storage.interface";

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(@Inject(STORAGE_SERVICE) private readonly storage: StorageService) {}

  async uploadMusic(
    file: UploadFile,
    userId: string
  ): Promise<{ id: string; name: string; url: string; size: number }> {
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .slice(0, 100);
    const id = `${userId}/${crypto.randomUUID()}-${sanitizedName}`;
    await this.storage.upload(file.buffer, id, file.mimetype);
    const url = await this.storage.getSignedUrl(id, 3600);

    this.logger.log(`Music uploaded: ${id}`);

    return {
      id,
      name: file.originalname,
      url,
      size: file.size,
    };
  }

  async deleteMusic(key: string): Promise<void> {
    await this.storage.delete(key);
    this.logger.log(`Music deleted: ${key}`);
  }
}
