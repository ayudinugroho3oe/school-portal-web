CREATE TABLE "contact_channels" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "typeCode" VARCHAR(40) NOT NULL,
  "label" VARCHAR(120) NOT NULL,
  "value" VARCHAR(500) NOT NULL,
  "url" VARCHAR(500),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "updatedByUserId" UUID NOT NULL,
  CONSTRAINT "contact_channels_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "social_links" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "platformCode" VARCHAR(40) NOT NULL,
  "label" VARCHAR(120) NOT NULL,
  "url" VARCHAR(500) NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "updatedByUserId" UUID NOT NULL,
  CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "call_to_actions" (
  "id" UUID NOT NULL,
  "schoolId" UUID NOT NULL,
  "code" VARCHAR(64) NOT NULL,
  "label" VARCHAR(120) NOT NULL,
  "targetUrl" VARCHAR(500) NOT NULL,
  "description" VARCHAR(500),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  "updatedByUserId" UUID NOT NULL,
  CONSTRAINT "call_to_actions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "contact_channels_schoolId_typeCode_key" ON "contact_channels"("schoolId", "typeCode");
CREATE INDEX "contact_channels_schoolId_sortOrder_id_idx" ON "contact_channels"("schoolId", "sortOrder", "id");
CREATE UNIQUE INDEX "social_links_schoolId_platformCode_key" ON "social_links"("schoolId", "platformCode");
CREATE INDEX "social_links_schoolId_sortOrder_id_idx" ON "social_links"("schoolId", "sortOrder", "id");
CREATE UNIQUE INDEX "call_to_actions_schoolId_code_key" ON "call_to_actions"("schoolId", "code");
CREATE INDEX "call_to_actions_schoolId_sortOrder_id_idx" ON "call_to_actions"("schoolId", "sortOrder", "id");

ALTER TABLE "contact_channels" ADD CONSTRAINT "contact_channels_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "call_to_actions" ADD CONSTRAINT "call_to_actions_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
