import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as Minio from "minio";
import { Readable } from "stream";
import { StorageService } from "./storage.interface";
import { stat } from "fs/promises";
import { createHmac } from "crypto";

@Injectable()
export class MinioStorageService implements StorageService, OnModuleInit {
  private readonly logger = new Logger(MinioStorageService.name);
  private client!: Minio.Client;
  private bucket!: string;
  private signingSecret!: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT;
    const port = parseInt(process.env.MINIO_PORT || "9000");
    const useSSL = process.env.MINIO_USE_SSL === "true";
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;
    this.bucket = process.env.MINIO_BUCKET || "spikeclips-clips";

    if (!endpoint || !accessKey || !secretKey) {
      throw new Error("MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY are required");
    }

    this.client = new Minio.Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit(): Promise<void> {
    this.signingSecret = process.env.CLIP_SIGNING_SECRET || "";
    if (!this.signingSecret) {
      throw new Error("CLIP_SIGNING_SECRET environment variable is required");
    }

    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      try {
        await this.client.makeBucket(this.bucket, "us-east-1");
        this.logger.log(`Created MinIO bucket: ${this.bucket}`);
      } catch (err) {
        if (err instanceof Minio.S3Error && err.code === "BucketAlreadyOwnedByYou") {
          this.logger.log(`MinIO bucket already exists: ${this.bucket}`);
        } else {
          throw err;
        }
      }
    } else {
      this.logger.log(`MinIO bucket exists: ${this.bucket}`);
    }
  }

  async upload(file: Buffer, key: string, contentType: string): Promise<string> {
    await this.client.putObject(this.bucket, key, file, file.length, {
      "Content-Type": contentType,
    });
    this.logger.log(`Uploaded to MinIO: ${key} (${file.length} bytes)`);
    return key;
  }

  async uploadFromFile(filePath: string, key: string, contentType: string): Promise<string> {
    const fileStats = await stat(filePath);
    await this.client.fPutObject(this.bucket, key, filePath, {
      "Content-Type": contentType,
    });
    this.logger.log(`Uploaded from file to MinIO: ${key} (${fileStats.size} bytes)`);
    return key;
  }

  async getSignedUrl(key: string, expiresInSec: number = 3600): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSec;
    const signature = createHmac("sha256", this.signingSecret)
      .update(`${key}:${expires}`)
      .digest("hex")
      .slice(0, 32);

    const baseUrl = process.env.CLIPS_BASE_URL || `http://localhost:${process.env.PORT || 3001}/api`;
    return `${baseUrl}/clips/download/${encodeURIComponent(key)}?expires=${expires}&sig=${signature}`;
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
    this.logger.log(`Deleted from MinIO: ${key}`);
  }

  async createReadStream(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }

  async healthCheck(): Promise<{ status: string; message?: string }> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      return exists
        ? { status: "ok" }
        : { status: "error", message: `Bucket "${this.bucket}" does not exist` };
    } catch (err) {
      return { status: "error", message: err instanceof Error ? err.message : "MinIO unreachable" };
    }
  }
}
