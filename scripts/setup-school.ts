import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma, assertDatabaseConfigured } from "../lib/prisma";
import { initializeSchoolSettings } from "../modules/school-settings/application/service";
import { initializeSchoolSettingsSchema } from "../modules/school-settings/validation/schemas";

async function main() {
  assertDatabaseConfigured();
  const email = requireEnv("BOOTSTRAP_SUPER_ADMIN_EMAIL");
  const settings = initializeSchoolSettingsSchema.parse({
    schoolCode: process.env.BOOTSTRAP_SCHOOL_CODE ?? "AR48",
    schoolName: process.env.BOOTSTRAP_SCHOOL_NAME ?? "TK Islam Ar Rahmah 48",
    isActive: true,
  });
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const password = requireEnv("BOOTSTRAP_SUPER_ADMIN_PASSWORD");
    const name = requireEnv("BOOTSTRAP_SUPER_ADMIN_NAME");
    const result = await auth.api.signUpEmail({ body: { email, password, name } });
    user = await prisma.user.findUniqueOrThrow({ where: { id: result.user.id } });
  }
  if (user.role !== "SUPER_ADMIN") user = await prisma.user.update({ where: { id: user.id }, data: { role: "SUPER_ADMIN" } });
  const existing = await prisma.schoolSettings.findUnique({ where: { key: "PRIMARY_SCHOOL" } });
  if (existing) { console.log("PRIMARY_SCHOOL already exists; no admin-managed content was overwritten."); return; }
  const record = await initializeSchoolSettings({ id: user.id, role: "SUPER_ADMIN" }, settings, crypto.randomUUID());
  console.log(`Provisioned ${record.key} (${record.schoolCode}) with an auditable Super Admin actor.`);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
