import { Module } from "@nestjs/common";
import { STORAGE_SERVICE } from "./storage.interface";
import { LocalStorageService } from "./local-storage.service";
import { MinioStorageService } from "./minio-storage.service";

const storageDriver = process.env.STORAGE_DRIVER || "local";
const storageProvider =
  storageDriver === "minio"
    ? { provide: STORAGE_SERVICE, useClass: MinioStorageService }
    : { provide: STORAGE_SERVICE, useClass: LocalStorageService };

@Module({
  providers: [storageProvider],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
