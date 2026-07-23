import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ApplicationError, entityNotFound, staleUpdate } from "@/modules/cms/domain/errors";
import type { SchoolContentRepository, SingletonKind } from "../domain/contracts";
import type { SchoolIdentityUpdate, SchoolProfileUpdate } from "../validation/schemas";

export async function ensureSchoolContentWorkingCopies(tx: Prisma.TransactionClient, school: { id: string; schoolName: string }, actorUserId?: string) {
  await tx.schoolIdentity.upsert({ where: { schoolId: school.id }, create: { schoolId: school.id, schoolName: school.schoolName, updatedByUserId: actorUserId }, update: {} });
  await tx.schoolProfile.upsert({ where: { schoolId: school.id }, create: { schoolId: school.id, updatedByUserId: actorUserId }, update: {} });
}

const usable = (status: string) => status === "ACTIVE" || status === "READY";
async function assertMedia(tx: Prisma.TransactionClient, schoolId: string, ids: (string | null | undefined)[]) {
  const selected = ids.filter((id): id is string => Boolean(id));
  if (!selected.length) return;
  const found = await tx.mediaAsset.findMany({ where: { schoolId, id: { in: selected } }, select: { id: true, status: true } });
  if (found.length !== new Set(selected).size || found.some((item) => !usable(item.status))) throw new ApplicationError("INVALID_MEDIA_REFERENCE", 422, "Referenced media must belong to the School and be usable.");
}

export class PrismaSchoolContentRepository implements SchoolContentRepository {
  read(kind: SingletonKind, schoolId: string) {
    return kind === "identity" ? prisma.schoolIdentity.findUnique({ where: { schoolId } }) : prisma.schoolProfile.findUnique({ where: { schoolId } });
  }
  updateIdentity(schoolId: string, actorUserId: string, requestId: string, input: SchoolIdentityUpdate) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.schoolIdentity.findUnique({ where: { schoolId } });
      if (!current) throw entityNotFound();
      if (current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()) throw staleUpdate();
      await assertMedia(tx, schoolId, [input.logoMediaId, input.logoDarkMediaId, input.faviconMediaId]);
      const { expectedUpdatedAt, ...data } = input;
      void expectedUpdatedAt;
      const result = await tx.schoolIdentity.update({ where: { schoolId }, data: { ...data, updatedByUserId: actorUserId } });
      await tx.contentAuditEvent.create({ data: { schoolId, actorUserId, entityType: "SCHOOL_IDENTITY", entityId: result.id, action: "UPDATE", fromStatus: current.status, toStatus: result.status, sourceUpdatedAt: result.updatedAt, requestId } });
      return result;
    });
  }
  updateProfile(schoolId: string, actorUserId: string, requestId: string, input: SchoolProfileUpdate) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.schoolProfile.findUnique({ where: { schoolId } });
      if (!current) throw entityNotFound();
      if (current.updatedAt.getTime() !== new Date(input.expectedUpdatedAt).getTime()) throw staleUpdate();
      await assertMedia(tx, schoolId, [input.principalPhotoMediaId]);
      const { expectedUpdatedAt, valuesJson, ...data } = input;
      void expectedUpdatedAt;
      const result = await tx.schoolProfile.update({ where: { schoolId }, data: { ...data, valuesJson: valuesJson === undefined ? undefined : valuesJson === null ? Prisma.JsonNull : valuesJson, updatedByUserId: actorUserId } });
      await tx.contentAuditEvent.create({ data: { schoolId, actorUserId, entityType: "SCHOOL_PROFILE", entityId: result.id, action: "UPDATE", fromStatus: current.status, toStatus: result.status, sourceUpdatedAt: result.updatedAt, requestId } });
      return result;
    });
  }
}
