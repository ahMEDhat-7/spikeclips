import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as Minio from "minio";
import { StorageService } from "./storage.interface";
import { stat } from "fs/promises";

@Injectable()
export class MinioStorageService implements StorageService, OnModuleInit {
  private readonly logger = new Logger(MinioStorageService.name);
  private client: Minio.Client;
  private bucket: string;

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
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, "us-east-1");
      this.logger.log(`Created MinIO bucket: ${this.bucket}`);
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
    return this.client.presignedGetObject(this.bucket, key, expiresInSec);
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
    this.logger.log(`Deleted from MinIO: ${key}`);
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
