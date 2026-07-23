import { Prisma } from "@/generated/prisma/client";
import { can, type Actor, type Permission } from "@/lib/auth/permissions";
import { assertDatabaseConfigured, prisma } from "@/lib/prisma";
import { ensureSchoolRoot } from "@/modules/school/application/service";
import { ensureSchoolContentWorkingCopies } from "@/modules/school-content/infrastructure/prisma-repository";
import { PRIMARY_SCHOOL_KEY } from "../domain/constants";
import { alreadyInitialized, forbidden, notFound, staleUpdate } from "../domain/errors";
import type { InitializeSchoolSettingsInput, UpdateSchoolSettingsInput } from "../validation/schemas";

function authorize(actor: Actor, permission: Permission) {
  if (!can(actor.role, permission)) throw forbidden();
}

const auditJson = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const jsonFields = ["schoolValues", "operatingHours", "socialLinks", "contactInfo", "footerContent", "ppdbInfo", "publicAnnouncements"] as const;
function normalizeJsonNulls(input: Record<string, unknown>) {
  const data = { ...input };
  for (const field of jsonFields) if (field in data && data[field] === null) data[field] = Prisma.JsonNull;
  return data;
}

export async function readSchoolSettings(actor: Actor) {
  authorize(actor, "school_settings.read");
  assertDatabaseConfigured();
  const settings = await prisma.schoolSettings.findUnique({ where: { key: PRIMARY_SCHOOL_KEY } });
  if (!settings) throw notFound();
  return settings;
}

export async function initializeSchoolSettings(actor: Actor, input: InitializeSchoolSettingsInput, requestId: string) {
  authorize(actor, "school_settings.initialize");
  assertDatabaseConfigured();
  try {
    return await prisma.$transaction(async (tx) => {
      if (await tx.schoolSettings.findUnique({ where: { key: PRIMARY_SCHOOL_KEY } })) throw alreadyInitialized();
      const school = await ensureSchoolRoot(tx, {
        schoolCode: input.schoolCode,
        schoolName: input.schoolName,
        isActive: true,
        timezone: input.timezone,
        locale: input.locale,
      });
      const data = normalizeJsonNulls({ ...input, schoolId: school.id, key: PRIMARY_SCHOOL_KEY, updatedByUserId: actor.id }) as Prisma.SchoolSettingsUncheckedCreateInput;
      const created = await tx.schoolSettings.create({ data });
      await ensureSchoolContentWorkingCopies(tx, school, actor.id);
      await tx.auditLog.create({ data: {
        actorUserId: actor.id, action: "SCHOOL_SETTINGS_INITIALIZED", entityType: "SchoolSettings",
        entityId: created.id, beforeData: Prisma.JsonNull, afterData: auditJson(created), requestId,
      } });
      return created;
    });
  } catch (error) {
    if (error instanceof DomainError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw alreadyInitialized();
    throw error;
  }
}

import { DomainError } from "../domain/errors";

export async function updateSchoolSettings(actor: Actor, input: UpdateSchoolSettingsInput, requestId: string) {
  authorize(actor, "school_settings.update");
  assertDatabaseConfigured();
  const { expectedUpdatedAt, ...changes } = input;
  return prisma.$transaction(async (tx) => {
    const before = await tx.schoolSettings.findUnique({ where: { key: PRIMARY_SCHOOL_KEY } });
    if (!before) throw notFound();
    const updatedAt = new Date();
    const result = await tx.schoolSettings.updateMany({
      where: { key: PRIMARY_SCHOOL_KEY, updatedAt: new Date(expectedUpdatedAt) },
      data: normalizeJsonNulls({ ...changes, updatedAt, updatedByUserId: actor.id }) as Prisma.SchoolSettingsUpdateManyMutationInput,
    });
    if (result.count !== 1) throw staleUpdate();
    const after = await tx.schoolSettings.findUniqueOrThrow({ where: { key: PRIMARY_SCHOOL_KEY } });
    await tx.auditLog.create({ data: {
      actorUserId: actor.id, action: "SCHOOL_SETTINGS_UPDATED", entityType: "SchoolSettings",
      entityId: after.id, beforeData: auditJson(before), afterData: auditJson(after), requestId,
    } });
    return after;
  });
}
