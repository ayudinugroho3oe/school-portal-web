ALTER TABLE "school_settings"
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "principalPhotoUrl" TEXT,
  ADD COLUMN "principalWelcome" TEXT,
  ADD COLUMN "faviconUrl" TEXT,
  ADD COLUMN "heroImageUrl" TEXT,
  ADD COLUMN "buildingImageUrl" TEXT,
  ADD COLUMN "history" TEXT,
  ADD COLUMN "schoolValues" JSONB,
  ADD COLUMN "operatingHours" JSONB,
  ADD COLUMN "socialLinks" JSONB,
  ADD COLUMN "googleMapsUrl" TEXT,
  ADD COLUMN "contactInfo" JSONB,
  ADD COLUMN "footerContent" JSONB,
  ADD COLUMN "ppdbInfo" JSONB,
  ADD COLUMN "publicAnnouncements" JSONB;

ALTER TABLE "school_settings"
  ALTER COLUMN "schoolLevel" DROP NOT NULL,
  ALTER COLUMN "schoolLevel" DROP DEFAULT,
  ALTER COLUMN "ownershipStatus" DROP NOT NULL,
  ALTER COLUMN "ownershipStatus" DROP DEFAULT,
  ALTER COLUMN "principalName" DROP NOT NULL,
  ALTER COLUMN "whatsapp" DROP NOT NULL,
  ALTER COLUMN "addressLine" DROP NOT NULL,
  ALTER COLUMN "city" DROP NOT NULL,
  ALTER COLUMN "province" DROP NOT NULL,
  ALTER COLUMN "academicYearLabel" DROP NOT NULL;
