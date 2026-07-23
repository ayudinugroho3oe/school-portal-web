import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { initializeSchoolSettings, readSchoolSettings, updateSchoolSettings } from "@/modules/school-settings/application/service";

const superAdmin = { id: crypto.randomUUID(), role: "SUPER_ADMIN" as const };
const schoolAdmin = { id: crypto.randomUUID(), role: "SCHOOL_ADMIN" as const };
const staff = { id: crypto.randomUUID(), role: "STAFF" as const };
const teacher = { id: crypto.randomUUID(), role: "TEACHER" as const };
const initial = {
  schoolCode: "TEST48", schoolName: "Sekolah Integration Test", isActive: true, schoolLevel: "PAUD_TK" as const,
  ownershipStatus: "PRIVATE" as const, principalName: "Test Principal", whatsapp: "6281234567890",
  addressLine: "Test Address", city: "Test City", province: "Test Province", timezone: "Asia/Jakarta",
  locale: "id-ID", academicYearLabel: "2026/2027",
};

function assertTestDatabase() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (url.pathname !== "/arrahmah_sms_test") throw new Error("Integration tests refuse to run outside arrahmah_sms_test.");
}

async function clean() {
  await prisma.contentPublicationHead.deleteMany(); await prisma.contentPublication.deleteMany(); await prisma.contentAuditEvent.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.program.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.galleryAlbum.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.contactChannel.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.callToAction.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.schoolSettings.deleteMany();
  await prisma.schoolIdentity.deleteMany();
  await prisma.schoolProfile.deleteMany();
  await prisma.school.deleteMany();
}

describe.sequential("School Settings PostgreSQL integration", () => {
  beforeAll(async () => { assertTestDatabase(); await clean(); });
  afterAll(async () => { await clean(); await prisma.$disconnect(); });

  it("initializes atomically for SUPER_ADMIN and writes audit", async () => {
    const record = await initializeSchoolSettings(superAdmin, initial, "init-request");
    expect(record.key).toBe("PRIMARY_SCHOOL");
    expect(await prisma.school.count({ where: { id: record.schoolId, isActive: true } })).toBe(1);
    const audit = await prisma.auditLog.findFirstOrThrow({ where: { action: "SCHOOL_SETTINGS_INITIALIZED" } });
    expect(audit.actorUserId).toBe(superAdmin.id); expect(audit.beforeData).toBeNull(); expect(audit.requestId).toBe("init-request");
  });

  it("rejects initialize for non-SUPER_ADMIN", async () => {
    await expect(initializeSchoolSettings(schoolAdmin, initial, "denied")).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(await prisma.schoolSettings.count()).toBe(1);
  });

  it("enforces read permission matrix", async () => {
    await expect(readSchoolSettings(superAdmin)).resolves.toMatchObject({ schoolCode: "TEST48" });
    await expect(readSchoolSettings(schoolAdmin)).resolves.toBeTruthy();
    await expect(readSchoolSettings(staff)).resolves.toBeTruthy();
    await expect(readSchoolSettings(teacher)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("updates for SUPER_ADMIN and records before/after audit", async () => {
    const before = await readSchoolSettings(superAdmin);
    const after = await updateSchoolSettings(superAdmin, { schoolName: "Updated by Super", expectedUpdatedAt: before.updatedAt.toISOString() }, "super-update");
    expect(after.schoolName).toBe("Updated by Super");
    const audit = await prisma.auditLog.findFirstOrThrow({ where: { requestId: "super-update" } });
    expect(audit.beforeData).toBeTruthy(); expect(audit.afterData).toBeTruthy();
  });

  it("updates for SCHOOL_ADMIN and rejects STAFF", async () => {
    const before = await readSchoolSettings(schoolAdmin);
    const after = await updateSchoolSettings(schoolAdmin, { schoolMotto: "Integration", expectedUpdatedAt: before.updatedAt.toISOString() }, "school-admin-update");
    expect(after.schoolMotto).toBe("Integration");
    await expect(updateSchoolSettings(staff, { schoolMotto: "Denied", expectedUpdatedAt: after.updatedAt.toISOString() }, "staff-update")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects a stale optimistic concurrency token", async () => {
    const current = await readSchoolSettings(superAdmin);
    const stale = current.updatedAt.toISOString();
    await updateSchoolSettings(superAdmin, { schoolMotto: "Fresh", expectedUpdatedAt: stale }, "fresh-update");
    await expect(updateSchoolSettings(superAdmin, { schoolMotto: "Stale", expectedUpdatedAt: stale }, "stale-update")).rejects.toMatchObject({ code: "STALE_UPDATE" });
  });

  it("writes an audit record for a valid no-op update", async () => {
    const current = await readSchoolSettings(superAdmin);
    await updateSchoolSettings(superAdmin, { schoolName: current.schoolName, expectedUpdatedAt: current.updatedAt.toISOString() }, "noop-update");
    expect(await prisma.auditLog.count({ where: { requestId: "noop-update" } })).toBe(1);
  });

  it("rolls back settings update when audit persistence fails", async () => {
    const before = await readSchoolSettings(superAdmin);
    await prisma.$executeRawUnsafe('ALTER TABLE "audit_logs" RENAME TO "audit_logs_unavailable"');
    try {
      await expect(updateSchoolSettings(superAdmin, { schoolMotto: "Must Roll Back", expectedUpdatedAt: before.updatedAt.toISOString() }, "rollback-update")).rejects.toBeTruthy();
    } finally {
      await prisma.$executeRawUnsafe('ALTER TABLE "audit_logs_unavailable" RENAME TO "audit_logs"');
    }
    const after = await readSchoolSettings(superAdmin);
    expect(after.schoolMotto).toBe(before.schoolMotto); expect(after.updatedAt.toISOString()).toBe(before.updatedAt.toISOString());
  });
});
