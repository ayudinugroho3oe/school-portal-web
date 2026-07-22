import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  PrismaCallToActionRepository,
  PrismaContactChannelRepository,
  PrismaSocialLinkRepository,
} from "@/modules/configuration/infrastructure/prisma-repositories";

const actorId = crypto.randomUUID();
let schoolA: string;
let schoolB: string;

function assertTestDatabase() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (url.pathname !== "/arrahmah_sms_test") throw new Error("Integration tests refuse to run outside arrahmah_sms_test.");
}

async function clean() {
  await prisma.contentPublicationHead.deleteMany(); await prisma.contentPublication.deleteMany(); await prisma.contentAuditEvent.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.contactChannel.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.callToAction.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.schoolSettings.deleteMany();
  await prisma.school.deleteMany();
}

describe.sequential("Configuration repositories PostgreSQL integration", () => {
  beforeAll(async () => {
    assertTestDatabase();
    await clean();
    const schools = await Promise.all([
      prisma.school.create({ data: { schoolCode: "CONFIG_A", schoolName: "Configuration School A" } }),
      prisma.school.create({ data: { schoolCode: "CONFIG_B", schoolName: "Configuration School B" } }),
    ]);
    [schoolA, schoolB] = schools.map(({ id }) => id);
  });
  afterAll(async () => {
    await clean();
    await prisma.$disconnect();
  });

  it("scopes Contact Channel CRUD and uniqueness by schoolId", async () => {
    const repository = new PrismaContactChannelRepository();
    const input = { typeCode: "EMAIL", label: "Email", value: "school@example.invalid", url: "mailto:school@example.invalid", sortOrder: 0, isActive: true };
    const first = await repository.create(schoolA, actorId, input);
    await expect(repository.create(schoolA, actorId, input)).rejects.toMatchObject({ code: "DUPLICATE_CODE" });
    await expect(repository.create(schoolB, actorId, input)).resolves.toMatchObject({ typeCode: "EMAIL" });
    expect((await repository.list(schoolA)).items).toHaveLength(1);
    expect(await repository.findById(schoolB, first.id)).toBeNull();
    const updated = await repository.update(schoolA, first.id, actorId, first.updatedAt, { label: "Official Email" });
    const inactive = await repository.setActive(schoolA, first.id, actorId, updated.updatedAt, false);
    expect(inactive.isActive).toBe(false);
  });

  it("scopes Social Link create/read/update/deactivate", async () => {
    const repository = new PrismaSocialLinkRepository();
    const first = await repository.create(schoolA, actorId, { platformCode: "INSTAGRAM", label: "Instagram", url: "https://instagram.com/a", sortOrder: 0, isActive: true });
    await repository.create(schoolB, actorId, { platformCode: "INSTAGRAM", label: "Instagram", url: "https://instagram.com/b", sortOrder: 0, isActive: true });
    expect((await repository.list(schoolA)).items).toHaveLength(1);
    expect(await repository.findById(schoolB, first.id)).toBeNull();
    const updated = await repository.update(schoolA, first.id, actorId, first.updatedAt, { url: "https://instagram.com/updated" });
    await expect(repository.setActive(schoolA, first.id, actorId, updated.updatedAt, false)).resolves.toMatchObject({ isActive: false });
  });

  it("reorders CTA atomically and rolls back invalid collections", async () => {
    const repository = new PrismaCallToActionRepository();
    const one = await repository.create(schoolA, actorId, { code: "ONE", label: "One", targetUrl: "/one", description: null, sortOrder: 0, isActive: true });
    const two = await repository.create(schoolA, actorId, { code: "TWO", label: "Two", targetUrl: "/two", description: null, sortOrder: 1, isActive: true });
    await repository.create(schoolB, actorId, { code: "ONE", label: "One B", targetUrl: "/one", description: null, sortOrder: 0, isActive: true });
    const before = await repository.list(schoolA);
    const reordered = await repository.reorder(schoolA, { ids: [two.id, one.id], expectedCollectionUpdatedAt: before.collectionUpdatedAt!, actorUserId: actorId });
    expect(reordered.items.map(({ id }) => id)).toEqual([two.id, one.id]);
    const snapshot = reordered.items.map(({ id, sortOrder }) => ({ id, sortOrder }));
    await expect(repository.reorder(schoolA, { ids: [one.id, crypto.randomUUID()], expectedCollectionUpdatedAt: reordered.collectionUpdatedAt!, actorUserId: actorId })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect((await repository.list(schoolA)).items.map(({ id, sortOrder }) => ({ id, sortOrder }))).toEqual(snapshot);
    expect((await repository.list(schoolB)).items).toHaveLength(1);
  });
});
