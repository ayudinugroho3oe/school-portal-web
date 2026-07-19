import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function main() {
  const email = requireEnv("BOOTSTRAP_SUPER_ADMIN_EMAIL");
  const currentPassword = requireEnv("BOOTSTRAP_SUPER_ADMIN_PASSWORD");
  const newPassword = randomBytes(36).toString("base64url");
  const login = await auth.api.signInEmail({ body: { email, password: currentPassword }, returnHeaders: true });
  const cookie = login.headers.get("set-cookie");
  if (!cookie) throw new Error("Better Auth did not return a session cookie for credential rotation.");
  await auth.api.changePassword({ body: { currentPassword, newPassword, revokeOtherSessions: true }, headers: new Headers({ cookie }) });
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  await prisma.session.deleteMany({ where: { userId: user.id } });
  const path = ".env.local";
  const source = await readFile(path, "utf8");
  const updated = source.replace(/^BOOTSTRAP_SUPER_ADMIN_PASSWORD=.*$/m, `BOOTSTRAP_SUPER_ADMIN_PASSWORD="${newPassword}"`);
  if (updated === source) throw new Error("Local bootstrap credential entry was not found.");
  await writeFile(path, updated, { encoding: "utf8" });
  console.log("Development Super Admin credential rotated; all existing sessions revoked.");
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "Credential rotation failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
