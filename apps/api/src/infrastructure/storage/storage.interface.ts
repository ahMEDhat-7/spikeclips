export const STORAGE_SERVICE = "STORAGE_SERVICE";

export interface StorageService {
  upload(file: Buffer, key: string, contentType: string): Promise<string>;
  getSignedUrl(key: string, expiresInSec?: number): Promise<string>;
}
