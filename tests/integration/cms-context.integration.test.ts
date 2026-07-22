import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createCmsRequestContext } from "@/modules/cms/application/context";
import { CanonicalSchoolContextResolver } from "@/modules/cms/infrastructure/school-context-resolver";
import { provisionSchoolRoot } from "@/modules/school/application/service";

function assertTestDatabase() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (url.pathname !== "/arrahmah_sms_test") throw new Error("Integration tests refuse to run outside arrahmah_sms_test.");
}

async function clean() {
  await prisma.contentPublicationHead.deleteMany(); await prisma.contentPublication.deleteMany(); await prisma.contentAuditEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.schoolSettings.deleteMany();
  await prisma.school.deleteMany();
}

describe.sequential("CMS application context PostgreSQL integration", () => {
  beforeAll(async () => {
    assertTestDatabase();
    await clean();
  });
  afterAll(async () => {
    await clean();
    await prisma.$disconnect();
  });

  it("derives schoolId from the canonical installation root", async () => {
    const school = await provisionSchoolRoot({
      schoolCode: "CMS_CONTEXT",
      schoolName: "CMS Context Test School",
      isActive: true,
      timezone: "Asia/Jakarta",
      locale: "id-ID",
    });
    const context = await createCmsRequestContext(
      { id: crypto.randomUUID(), role: "SUPER_ADMIN" },
      "school_settings.read",
      "cms-context-integration",
      new CanonicalSchoolContextResolver(),
    );
    expect(context.schoolId).toBe(school.id);
    expect(await prisma.school.count()).toBe(1);
  });
});
