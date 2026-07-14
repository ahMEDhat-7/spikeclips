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
  private readonly BUCKET = "music";

  constructor(@Inject(STORAGE_SERVICE) private readonly storage: StorageService) {}

  async uploadMusic(
    file: UploadFile,
    userId: string
  ): Promise<{ id: string; name: string; url: string; size: number }> {
    const id = `${userId}/${crypto.randomUUID()}-${file.originalname}`;
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

  async deleteMusic(_key: string): Promise<void> {
    this.logger.log(`Music deletion requested (not implemented for local driver)`);
  }
}
