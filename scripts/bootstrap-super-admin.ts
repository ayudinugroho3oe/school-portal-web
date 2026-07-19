import "dotenv/config";
import { auth } from "../lib/auth";
import { assertDatabaseConfigured, prisma } from "../lib/prisma";

async function main() {
  assertDatabaseConfigured();
  const email = requireEnv("BOOTSTRAP_SUPER_ADMIN_EMAIL").trim().toLowerCase();
  const password = requireEnv("BOOTSTRAP_SUPER_ADMIN_PASSWORD");
  const name = requireEnv("BOOTSTRAP_SUPER_ADMIN_NAME").trim();
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const result = await auth.api.signUpEmail({ body: { email, password, name } });
    user = await prisma.user.findUniqueOrThrow({ where: { id: result.user.id } });
    user = await prisma.user.update({ where: { id: user.id }, data: { role: "SUPER_ADMIN" } });
    await prisma.session.deleteMany({ where: { userId: user.id } });
    console.log("Super Admin development created through Better Auth.");
    return;
  }

  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Existing account does not have SUPER_ADMIN role; automatic reconciliation is refused because an auditable school entity is not initialized.");
  }
  console.log("Super Admin development already exists; no credential or role was changed.");
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Super Admin bootstrap failed.");
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
