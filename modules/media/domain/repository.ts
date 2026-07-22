import type { SchoolId } from "@/modules/cms/domain/contracts";
import type { MediaAsset, MediaStatus } from "./types";

export type CreateMediaMetadata = Omit<MediaAsset, "createdAt" | "updatedAt">;

export interface MediaAssetRepository {
  list(schoolId: SchoolId, status?: MediaStatus): Promise<readonly MediaAsset[]>;
  findById(schoolId: SchoolId, id: string): Promise<MediaAsset | null>;
  findByChecksum(schoolId: SchoolId, checksum: string): Promise<MediaAsset | null>;
  create(schoolId: SchoolId, input: CreateMediaMetadata): Promise<MediaAsset>;
  updateMetadata(schoolId: SchoolId, id: string, expectedUpdatedAt: Date, altText: string | null, caption: string | null): Promise<MediaAsset>;
  setStatus(schoolId: SchoolId, id: string, expectedUpdatedAt: Date, status: MediaStatus): Promise<MediaAsset>;
}
