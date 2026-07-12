import { Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { writeFile, readFile, mkdir, stat } from "fs/promises";
import { join, resolve } from "path";
import { StorageService } from "./storage.interface";
import { randomBytes, createHmac, timingSafeEqual } from "crypto";

const CLIPS_DIR = process.env.CLIPS_DIR || "/tmp/spikeclips-clips";
const SIGNING_SECRET = process.env.CLIP_SIGNING_SECRET || "spikeclips-dev-signing-secret";

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger(LocalStorageService.name);

  async upload(file: Buffer, key: string, _contentType: string): Promise<string> {
    const filePath = join(CLIPS_DIR, key);
    const resolved = resolve(filePath);
    if (!resolved.startsWith(resolve(CLIPS_DIR))) {
      throw new ForbiddenException("Invalid storage key");
    }

    const dir = resolved.substring(0, resolved.lastIndexOf("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(resolved, file);

    this.logger.log(`Stored file: ${resolved} (${file.length} bytes)`);
    return key;
  }

  async uploadFromFile(filePath: string, key: string, _contentType: string): Promise<string> {
    const destPath = join(CLIPS_DIR, key);
    const resolvedDest = resolve(destPath);
    if (!resolvedDest.startsWith(resolve(CLIPS_DIR))) {
      throw new ForbiddenException("Invalid storage key");
    }

    const dir = resolvedDest.substring(0, resolvedDest.lastIndexOf("/"));
    await mkdir(dir, { recursive: true });

    const fileBuffer = await readFile(filePath);
    await writeFile(resolvedDest, fileBuffer);

    this.logger.log(`Stored file from ${filePath}: ${resolvedDest} (${fileBuffer.length} bytes)`);
    return key;
  }

  async getSignedUrl(key: string, expiresInSec: number = 3600): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSec;
    const signature = createHmac("sha256", SIGNING_SECRET)
      .update(`${key}:${expires}`)
      .digest("hex")
      .slice(0, 32);

    const baseUrl = process.env.CLIPS_BASE_URL || `http://localhost:${process.env.PORT || 3001}/api`;
    return `${baseUrl}/clips/download/${encodeURIComponent(key)}?expires=${expires}&sig=${signature}`;
  }

  static verifySignature(key: string, expires: number, sig: string): boolean {
    if (Date.now() / 1000 > expires) return false;

    const expected = createHmac("sha256", SIGNING_SECRET)
      .update(`${key}:${expires}`)
      .digest("hex")
      .slice(0, 32);

    try {
      return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  }
}
