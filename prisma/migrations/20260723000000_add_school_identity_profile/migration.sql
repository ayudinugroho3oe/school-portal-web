CREATE TABLE "school_identities" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "schoolName" VARCHAR(160) NOT NULL,
  "shortName" VARCHAR(80),
  "tagline" VARCHAR(150),
  "logoMediaId" UUID,
  "logoDarkMediaId" UUID,
  "faviconMediaId" UUID,
  "status" "ContentLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedByUserId" UUID,
  CONSTRAINT "school_identities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "school_profiles" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "summary" VARCHAR(500),
  "history" VARCHAR(10000),
  "vision" VARCHAR(5000),
  "mission" VARCHAR(5000),
  "principalName" VARCHAR(120),
  "principalPhotoMediaId" UUID,
  "principalGreeting" VARCHAR(5000),
  "valuesJson" JSONB,
  "status" "ContentLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedByUserId" UUID,
  CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

INSERT INTO "school_identities" ("id", "schoolId", "schoolName", "shortName", "tagline", "createdAt", "updatedAt", "updatedByUserId")
SELECT (substr(md5('identity:' || s."id"::text),1,8)||'-'||substr(md5('identity:' || s."id"::text),9,4)||'-4'||substr(md5('identity:' || s."id"::text),14,3)||'-a'||substr(md5('identity:' || s."id"::text),18,3)||'-'||substr(md5('identity:' || s."id"::text),21,12))::uuid,
       s."id", s."schoolName", ss."shortName", left(ss."schoolMotto",150), COALESCE(ss."createdAt",s."createdAt"), COALESCE(ss."updatedAt",s."updatedAt"), ss."updatedByUserId"
FROM "schools" s LEFT JOIN "school_settings" ss ON ss."schoolId"=s."id";

INSERT INTO "school_profiles" ("id", "schoolId", "history", "vision", "mission", "principalName", "principalGreeting", "valuesJson", "createdAt", "updatedAt", "updatedByUserId")
SELECT (substr(md5('profile:' || s."id"::text),1,8)||'-'||substr(md5('profile:' || s."id"::text),9,4)||'-4'||substr(md5('profile:' || s."id"::text),14,3)||'-a'||substr(md5('profile:' || s."id"::text),18,3)||'-'||substr(md5('profile:' || s."id"::text),21,12))::uuid,
       s."id", ss."history", ss."vision", ss."mission", ss."principalName", ss."principalWelcome", ss."schoolValues", COALESCE(ss."createdAt",s."createdAt"), COALESCE(ss."updatedAt",s."updatedAt"), ss."updatedByUserId"
FROM "schools" s LEFT JOIN "school_settings" ss ON ss."schoolId"=s."id";

CREATE UNIQUE INDEX "school_identities_schoolId_key" ON "school_identities"("schoolId");
CREATE INDEX "school_identities_schoolId_status_idx" ON "school_identities"("schoolId", "status");
CREATE UNIQUE INDEX "school_profiles_schoolId_key" ON "school_profiles"("schoolId");
CREATE INDEX "school_profiles_schoolId_status_idx" ON "school_profiles"("schoolId", "status");

ALTER TABLE "school_identities" ADD CONSTRAINT "school_identities_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "school_identities" ADD CONSTRAINT "school_identities_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "school_identities" ADD CONSTRAINT "school_identities_logoDarkMediaId_fkey" FOREIGN KEY ("logoDarkMediaId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "school_identities" ADD CONSTRAINT "school_identities_faviconMediaId_fkey" FOREIGN KEY ("faviconMediaId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "school_profiles" ADD CONSTRAINT "school_profiles_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "school_profiles" ADD CONSTRAINT "school_profiles_principalPhotoMediaId_fkey" FOREIGN KEY ("principalPhotoMediaId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
