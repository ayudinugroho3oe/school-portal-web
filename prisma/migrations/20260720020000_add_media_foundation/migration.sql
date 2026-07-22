CREATE TYPE "MediaAssetStatus" AS ENUM ('PENDING', 'READY', 'ACTIVE', 'ARCHIVED', 'FAILED');

CREATE TABLE "media_assets" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "storageProvider" VARCHAR(40) NOT NULL,
  "storageKey" VARCHAR(500) NOT NULL,
  "originalFilename" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "altText" VARCHAR(250),
  "caption" VARCHAR(500),
  "checksum" CHAR(64) NOT NULL,
  "status" "MediaAssetStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "media_assets_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "media_assets_schoolId_storageKey_key" ON "media_assets"("schoolId", "storageKey");
CREATE INDEX "media_assets_schoolId_status_createdAt_idx" ON "media_assets"("schoolId", "status", "createdAt");
CREATE INDEX "media_assets_schoolId_checksum_idx" ON "media_assets"("schoolId", "checksum");
