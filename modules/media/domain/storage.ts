export type StoredObjectMetadata = Readonly<{ sizeBytes: number; contentType: string }>;

export interface MediaStorage {
  readonly provider: string;
  upload(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  metadata(key: string): Promise<StoredObjectMetadata | null>;
  resolveUrl(key: string): Promise<string>;
}
