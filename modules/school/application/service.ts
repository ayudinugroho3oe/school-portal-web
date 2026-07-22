import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { assertDatabaseConfigured, prisma } from "@/lib/prisma";
import { ambiguousSchoolRoot, schoolRootNotFound, schoolSettingsConflict } from "../domain/errors";
import type { ProvisionSchoolRootInput } from "../validation/schemas";

type SchoolClient = PrismaClient | Prisma.TransactionClient;

async function findSingleActiveSchool(client: SchoolClient) {
  const activeSchools = await client.school.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" }, take: 2 });
  if (activeSchools.length > 1) throw ambiguousSchoolRoot();
  return activeSchools[0] ?? null;
}

export async function ensureSchoolRoot(client: SchoolClient, input: ProvisionSchoolRootInput) {
  const activeSchool = await findSingleActiveSchool(client);
  const settings = await client.schoolSettings.findMany({ orderBy: { createdAt: "asc" }, take: 2 });
  if (settings.length > 1) throw ambiguousSchoolRoot();
  const compatibilitySettings = settings[0] ?? null;

  if (activeSchool) {
    if (compatibilitySettings && compatibilitySettings.schoolId !== activeSchool.id) throw schoolSettingsConflict();
    return activeSchool;
  }

  const anySchools = await client.school.findMany({ orderBy: { createdAt: "asc" }, take: 2 });
  if (anySchools.length > 0 || compatibilitySettings) throw ambiguousSchoolRoot();
  return client.school.create({ data: input });
}

export async function resolveCanonicalSchool(client: SchoolClient = prisma) {
  assertDatabaseConfigured();
  const school = await findSingleActiveSchool(client);
  if (!school) throw schoolRootNotFound();
  return school;
}

export async function provisionSchoolRoot(input: ProvisionSchoolRootInput) {
  assertDatabaseConfigured();
  return prisma.$transaction((tx) => ensureSchoolRoot(tx, input));
}
