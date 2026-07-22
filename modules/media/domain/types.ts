import type { SchoolId } from "@/modules/cms/domain/contracts";

export const mediaStatuses = ["PENDING", "READY", "ACTIVE", "ARCHIVED", "FAILED"] as const;
export type MediaStatus = (typeof mediaStatuses)[number];

export type MediaAsset = Readonly<{
  id: string;
  schoolId: SchoolId;
  storageProvider: string;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  checksum: string;
  status: MediaStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type MediaUpload = Readonly<{
  filename: string;
  declaredMimeType: string;
  bytes: Uint8Array;
  altText?: string | null;
  caption?: string | null;
}>;
