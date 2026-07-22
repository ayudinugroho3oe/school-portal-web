import { config } from "dotenv";

config({ path: ".env.local", override: false, quiet: true });
const setupEnvFile = process.env.SETUP_ENV_FILE;
if (setupEnvFile) {
  if (![".env.local", ".env.test"].includes(setupEnvFile)) throw new Error("SETUP_ENV_FILE is not allowed.");
  config({ path: setupEnvFile, override: true, quiet: true });
}

let disconnect: (() => Promise<void>) | undefined;

async function main() {
  const { auth } = await import("../lib/auth");
  const { prisma, assertDatabaseConfigured } = await import("../lib/prisma");
  disconnect = () => prisma.$disconnect();
  const { initializeSchoolSettings } = await import("../modules/school-settings/application/service");
  const { initializeSchoolSettingsSchema } = await import("../modules/school-settings/validation/schemas");
  const { resolveCanonicalSchool } = await import("../modules/school/application/service");
  assertDatabaseConfigured();
  const email = requireEnv("BOOTSTRAP_SUPER_ADMIN_EMAIL");
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const password = requireEnv("BOOTSTRAP_SUPER_ADMIN_PASSWORD");
    const name = requireEnv("BOOTSTRAP_SUPER_ADMIN_NAME");
    const result = await auth.api.signUpEmail({ body: { email, password, name } });
    user = await prisma.user.findUniqueOrThrow({ where: { id: result.user.id } });
  }
  if (user.role !== "SUPER_ADMIN") user = await prisma.user.update({ where: { id: user.id }, data: { role: "SUPER_ADMIN" } });
  const existing = await prisma.schoolSettings.findUnique({ where: { key: "PRIMARY_SCHOOL" } });
  if (existing) {
    await resolveCanonicalSchool();
    console.log("Installation School root and compatibility settings already exist; no admin-managed content was overwritten.");
    return;
  }
  const settings = initializeSchoolSettingsSchema.parse({
    schoolCode: requireEnv("BOOTSTRAP_SCHOOL_CODE"),
    schoolName: requireEnv("BOOTSTRAP_SCHOOL_NAME"),
    isActive: true,
  });
  const record = await initializeSchoolSettings({ id: user.id, role: "SUPER_ADMIN" }, settings, crypto.randomUUID());
  console.log(`Provisioned ${record.key} (${record.schoolCode}) with an auditable Super Admin actor.`);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => disconnect?.());
