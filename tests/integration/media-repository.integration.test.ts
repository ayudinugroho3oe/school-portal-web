import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { PrismaMediaAssetRepository } from "@/modules/media/infrastructure/prisma-repository";

let schoolA: string; let schoolB: string;
const actorId = crypto.randomUUID();
function assertTestDatabase() { if (new URL(process.env.DATABASE_URL ?? "").pathname !== "/arrahmah_sms_test") throw new Error("Integration tests refuse to run outside arrahmah_sms_test."); }
async function clean() { await prisma.contentPublicationHead.deleteMany(); await prisma.contentPublication.deleteMany(); await prisma.contentAuditEvent.deleteMany(); await prisma.galleryItem.deleteMany(); await prisma.program.deleteMany(); await prisma.teacherProfile.deleteMany(); await prisma.galleryAlbum.deleteMany(); await prisma.testimonial.deleteMany(); await prisma.mediaAsset.deleteMany(); await prisma.contactChannel.deleteMany(); await prisma.socialLink.deleteMany(); await prisma.callToAction.deleteMany(); await prisma.auditLog.deleteMany(); await prisma.schoolSettings.deleteMany(); await prisma.school.deleteMany(); }

describe.sequential("Media repository PostgreSQL integration", () => {
  beforeAll(async () => {
    assertTestDatabase(); await clean();
    [schoolA, schoolB] = (await Promise.all([
      prisma.school.create({ data: { schoolCode: "MEDIA_A", schoolName: "Media School A" } }),
      prisma.school.create({ data: { schoolCode: "MEDIA_B", schoolName: "Media School B" } }),
    ])).map((school) => school.id);
  });
  afterAll(async () => { await clean(); await prisma.$disconnect(); });

  it("creates, reads, updates, archives, and scopes by School", async () => {
    const repository = new PrismaMediaAssetRepository();
    const input = { id: crypto.randomUUID(), schoolId: schoolA, storageProvider: "LOCAL", storageKey: `schools/${schoolA}/2026/07/a/original.jpg`, originalFilename: "kelas.jpg", mimeType: "image/jpeg", sizeBytes: 4, width: null, height: null, altText: null, caption: null, checksum: "a".repeat(64), status: "ACTIVE" as const, createdBy: actorId };
    const asset = await repository.create(schoolA, input);
    expect(await repository.findById(schoolB, asset.id)).toBeNull();
    expect((await repository.list(schoolA))).toHaveLength(1);
    expect((await repository.findByChecksum(schoolA, input.checksum))?.id).toBe(asset.id);
    const updated = await repository.updateMetadata(schoolA, asset.id, asset.updatedAt, "Anak belajar bersama", "Kegiatan kelas");
    const archived = await repository.setStatus(schoolA, asset.id, updated.updatedAt, "ARCHIVED");
    expect(archived.status).toBe("ARCHIVED");
    await expect(repository.setStatus(schoolB, asset.id, archived.updatedAt, "ACTIVE")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("keeps storage keys unique within a School", async () => {
    const repository = new PrismaMediaAssetRepository();
    const common = { storageProvider: "LOCAL", storageKey: `schools/${schoolA}/same/original.png`, originalFilename: "same.png", mimeType: "image/png", sizeBytes: 8, width: null, height: null, altText: null, caption: null, checksum: "b".repeat(64), status: "ACTIVE" as const, createdBy: actorId };
    await repository.create(schoolA, { ...common, id: crypto.randomUUID(), schoolId: schoolA });
    await expect(repository.create(schoolA, { ...common, id: crypto.randomUUID(), schoolId: schoolA })).rejects.toMatchObject({ code: "DUPLICATE_CODE" });
    await expect(repository.create(schoolB, { ...common, id: crypto.randomUUID(), schoolId: schoolB })).resolves.toBeTruthy();
  });
});
