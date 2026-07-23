import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { provisionSchoolRoot, resolveCanonicalSchool } from "@/modules/school/application/service";

const input = {
  schoolCode: "ROOT_TEST",
  schoolName: "School Root Integration Test",
  isActive: true as const,
  timezone: "Asia/Jakarta",
  locale: "id-ID",
};

function assertTestDatabase() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (url.pathname !== "/arrahmah_sms_test") throw new Error("Integration tests refuse to run outside arrahmah_sms_test.");
}

async function clean() {
  await prisma.contentPublicationHead.deleteMany(); await prisma.contentPublication.deleteMany(); await prisma.contentAuditEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.schoolSettings.deleteMany();
  await prisma.schoolIdentity.deleteMany();
  await prisma.schoolProfile.deleteMany();
  await prisma.school.deleteMany();
}

describe.sequential("canonical School root PostgreSQL integration", () => {
  beforeEach(async () => {
    assertTestDatabase();
    await clean();
  });
  afterAll(async () => {
    await clean();
    await prisma.$disconnect();
  });

  it("provisions exactly one active root and is idempotent", async () => {
    const first = await provisionSchoolRoot(input);
    const second = await provisionSchoolRoot(input);
    expect(second.id).toBe(first.id);
    expect(await prisma.school.count()).toBe(1);
    await expect(resolveCanonicalSchool()).resolves.toMatchObject({ id: first.id, isActive: true });
  });

  it("fails safely when more than one active root exists", async () => {
    await prisma.school.createMany({ data: [
      input,
      { ...input, schoolCode: "ROOT_OTHER", schoolName: "Other School" },
    ] });
    await expect(resolveCanonicalSchool()).rejects.toMatchObject({ code: "AMBIGUOUS_SCHOOL_ROOT" });
    await expect(provisionSchoolRoot(input)).rejects.toMatchObject({ code: "AMBIGUOUS_SCHOOL_ROOT" });
  });

  it("does not silently reactivate an inactive root", async () => {
    await prisma.school.create({ data: { ...input, isActive: false } });
    await expect(provisionSchoolRoot(input)).rejects.toMatchObject({ code: "AMBIGUOUS_SCHOOL_ROOT" });
  });
});
