-- Sprint 5.2.1: additive canonical School root.
-- Existing SchoolSettings remains the compatibility record during transition.

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM "school_settings") > 1 THEN
    RAISE EXCEPTION 'Canonical School migration requires at most one SchoolSettings record per installation.';
  END IF;

  IF EXISTS (SELECT 1 FROM "school_settings" WHERE "isActive" = false) THEN
    RAISE EXCEPTION 'Canonical School migration cannot infer an active installation root from inactive SchoolSettings.';
  END IF;
END $$;

CREATE TABLE "schools" (
  "id" UUID NOT NULL,
  "schoolCode" VARCHAR(20) NOT NULL,
  "schoolName" VARCHAR(150) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  "locale" TEXT NOT NULL DEFAULT 'id-ID',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "schools_schoolCode_key" ON "schools"("schoolCode");
CREATE INDEX "schools_isActive_idx" ON "schools"("isActive");

INSERT INTO "schools" (
  "id", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt"
)
SELECT
  "id", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt"
FROM "school_settings";

ALTER TABLE "school_settings" ADD COLUMN "schoolId" UUID;
UPDATE "school_settings" SET "schoolId" = "id" WHERE "schoolId" IS NULL;
ALTER TABLE "school_settings" ALTER COLUMN "schoolId" SET NOT NULL;

CREATE UNIQUE INDEX "school_settings_schoolId_key" ON "school_settings"("schoolId");
ALTER TABLE "school_settings"
  ADD CONSTRAINT "school_settings_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "schools"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
