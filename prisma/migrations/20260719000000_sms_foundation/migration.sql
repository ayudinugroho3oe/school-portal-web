CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'STAFF', 'TEACHER');
CREATE TYPE "SchoolLevel" AS ENUM ('PAUD_TK', 'TK', 'PAUD');
CREATE TYPE "OwnershipStatus" AS ENUM ('PRIVATE', 'PUBLIC');

CREATE TABLE "users" ("id" UUID NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "emailVerified" BOOLEAN NOT NULL DEFAULT false, "image" TEXT, "role" "Role" NOT NULL DEFAULT 'TEACHER', "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(3) NOT NULL, CONSTRAINT "users_pkey" PRIMARY KEY ("id"));
CREATE TABLE "sessions" ("id" UUID NOT NULL, "expiresAt" TIMESTAMPTZ(3) NOT NULL, "token" TEXT NOT NULL, "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(3) NOT NULL, "ipAddress" TEXT, "userAgent" TEXT, "userId" UUID NOT NULL, CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"));
CREATE TABLE "accounts" ("id" UUID NOT NULL, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "userId" UUID NOT NULL, "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT, "accessTokenExpiresAt" TIMESTAMPTZ(3), "refreshTokenExpiresAt" TIMESTAMPTZ(3), "scope" TEXT, "password" TEXT, "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(3) NOT NULL, CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"));
CREATE TABLE "verifications" ("id" UUID NOT NULL, "identifier" TEXT NOT NULL, "value" TEXT NOT NULL, "expiresAt" TIMESTAMPTZ(3) NOT NULL, "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(3) NOT NULL, CONSTRAINT "verifications_pkey" PRIMARY KEY ("id"));
CREATE TABLE "school_settings" ("id" UUID NOT NULL, "key" VARCHAR(50) NOT NULL, "schoolCode" VARCHAR(20) NOT NULL, "schoolName" VARCHAR(150) NOT NULL, "shortName" VARCHAR(50), "npsn" VARCHAR(8), "schoolLevel" "SchoolLevel" NOT NULL DEFAULT 'PAUD_TK', "ownershipStatus" "OwnershipStatus" NOT NULL DEFAULT 'PRIVATE', "foundationName" TEXT, "principalName" VARCHAR(120) NOT NULL, "operationalPermitNumber" TEXT, "accreditation" TEXT, "email" TEXT, "phone" VARCHAR(15), "whatsapp" VARCHAR(15) NOT NULL, "websiteUrl" TEXT, "addressLine" VARCHAR(250) NOT NULL, "village" TEXT, "district" TEXT, "city" VARCHAR(100) NOT NULL, "province" VARCHAR(100) NOT NULL, "postalCode" VARCHAR(5), "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta', "locale" TEXT NOT NULL DEFAULT 'id-ID', "academicYearLabel" VARCHAR(9) NOT NULL, "logoUrl" TEXT, "logoDarkUrl" TEXT, "schoolMotto" TEXT, "vision" TEXT, "mission" TEXT, "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ(3) NOT NULL, "updatedByUserId" UUID, CONSTRAINT "school_settings_pkey" PRIMARY KEY ("id"));
CREATE TABLE "audit_logs" ("id" UUID NOT NULL, "actorUserId" UUID NOT NULL, "action" TEXT NOT NULL, "entityType" TEXT NOT NULL, "entityId" UUID NOT NULL, "beforeData" JSONB, "afterData" JSONB NOT NULL, "requestId" TEXT NOT NULL, "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON "accounts"("providerId", "accountId");
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");
CREATE UNIQUE INDEX "school_settings_key_key" ON "school_settings"("key");
CREATE UNIQUE INDEX "school_settings_schoolCode_key" ON "school_settings"("schoolCode");
CREATE INDEX "audit_logs_entityId_createdAt_idx" ON "audit_logs"("entityId", "createdAt");
CREATE INDEX "audit_logs_requestId_idx" ON "audit_logs"("requestId");
CREATE INDEX "audit_logs_actorUserId_createdAt_idx" ON "audit_logs"("actorUserId", "createdAt");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "school_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
