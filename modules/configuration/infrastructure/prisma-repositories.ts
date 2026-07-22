import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { duplicateCode, entityNotFound, staleUpdate } from "@/modules/cms/domain/errors";
import type {
  CallToActionCreate,
  CallToActionRepository,
  CallToActionUpdate,
  ContactChannelCreate,
  ContactChannelRepository,
  ContactChannelUpdate,
  SocialLinkCreate,
  SocialLinkRepository,
  SocialLinkUpdate,
} from "../domain/repository";
import type { ConfigurationList, ReorderInput } from "../domain/types";

type Client = PrismaClient | Prisma.TransactionClient;

const collectionToken = (items: readonly { updatedAt: Date }[]) => {
  if (items.length === 0) return null;
  return new Date(Math.max(...items.map((item) => item.updatedAt.getTime()))).toISOString();
};

const listed = <T extends { updatedAt: Date }>(items: readonly T[]): ConfigurationList<T> => ({
  items,
  collectionUpdatedAt: collectionToken(items),
});

function mapWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw duplicateCode();
  throw error;
}

function assertCompleteOrder(currentIds: readonly string[], requestedIds: readonly string[]) {
  if (currentIds.length !== requestedIds.length || requestedIds.some((id) => !currentIds.includes(id))) {
    throw entityNotFound();
  }
}

function assertCollectionToken(items: readonly { updatedAt: Date }[], expected: string) {
  if (collectionToken(items) !== expected) throw staleUpdate();
}

export class PrismaContactChannelRepository implements ContactChannelRepository {
  constructor(private readonly client: Client = prisma) {}

  async list(schoolId: string) {
    return listed(await this.client.contactChannel.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));
  }

  findById(schoolId: string, id: string) {
    return this.client.contactChannel.findFirst({ where: { schoolId, id } });
  }

  async create(schoolId: string, actorUserId: string, input: ContactChannelCreate) {
    try {
      return await this.client.contactChannel.create({ data: { ...input, schoolId, updatedByUserId: actorUserId } });
    } catch (error) {
      mapWriteError(error);
    }
  }

  async update(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, input: Partial<ContactChannelUpdate>) {
    if (!await this.findById(schoolId, id)) throw entityNotFound();
    const result = await this.client.contactChannel.updateMany({
      where: { schoolId, id, updatedAt: expectedUpdatedAt },
      data: { ...input, updatedByUserId: actorUserId },
    });
    if (result.count !== 1) throw staleUpdate();
    return this.client.contactChannel.findFirstOrThrow({ where: { schoolId, id } });
  }

  async setActive(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, isActive: boolean) {
    return this.update(schoolId, id, actorUserId, expectedUpdatedAt, { isActive });
  }

  async reorder(schoolId: string, input: ReorderInput) {
    return prisma.$transaction(async (tx) => {
      const repository = new PrismaContactChannelRepository(tx);
      const current = await tx.contactChannel.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      assertCompleteOrder(current.map(({ id }) => id), input.ids);
      assertCollectionToken(current, input.expectedCollectionUpdatedAt);
      for (const [sortOrder, id] of input.ids.entries()) {
        await tx.contactChannel.updateMany({ where: { schoolId, id }, data: { sortOrder, updatedByUserId: input.actorUserId } });
      }
      return repository.list(schoolId);
    });
  }
}

export class PrismaSocialLinkRepository implements SocialLinkRepository {
  constructor(private readonly client: Client = prisma) {}

  async list(schoolId: string) {
    return listed(await this.client.socialLink.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));
  }

  findById(schoolId: string, id: string) {
    return this.client.socialLink.findFirst({ where: { schoolId, id } });
  }

  async create(schoolId: string, actorUserId: string, input: SocialLinkCreate) {
    try {
      return await this.client.socialLink.create({ data: { ...input, schoolId, updatedByUserId: actorUserId } });
    } catch (error) {
      mapWriteError(error);
    }
  }

  async update(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, input: Partial<SocialLinkUpdate>) {
    if (!await this.findById(schoolId, id)) throw entityNotFound();
    const result = await this.client.socialLink.updateMany({ where: { schoolId, id, updatedAt: expectedUpdatedAt }, data: { ...input, updatedByUserId: actorUserId } });
    if (result.count !== 1) throw staleUpdate();
    return this.client.socialLink.findFirstOrThrow({ where: { schoolId, id } });
  }

  async setActive(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, isActive: boolean) {
    return this.update(schoolId, id, actorUserId, expectedUpdatedAt, { isActive });
  }

  async reorder(schoolId: string, input: ReorderInput) {
    return prisma.$transaction(async (tx) => {
      const repository = new PrismaSocialLinkRepository(tx);
      const current = await tx.socialLink.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      assertCompleteOrder(current.map(({ id }) => id), input.ids);
      assertCollectionToken(current, input.expectedCollectionUpdatedAt);
      for (const [sortOrder, id] of input.ids.entries()) await tx.socialLink.updateMany({ where: { schoolId, id }, data: { sortOrder, updatedByUserId: input.actorUserId } });
      return repository.list(schoolId);
    });
  }
}

export class PrismaCallToActionRepository implements CallToActionRepository {
  constructor(private readonly client: Client = prisma) {}

  async list(schoolId: string) {
    return listed(await this.client.callToAction.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));
  }

  findById(schoolId: string, id: string) {
    return this.client.callToAction.findFirst({ where: { schoolId, id } });
  }

  async create(schoolId: string, actorUserId: string, input: CallToActionCreate) {
    try {
      return await this.client.callToAction.create({ data: { ...input, schoolId, updatedByUserId: actorUserId } });
    } catch (error) {
      mapWriteError(error);
    }
  }

  async update(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, input: Partial<CallToActionUpdate>) {
    if (!await this.findById(schoolId, id)) throw entityNotFound();
    const result = await this.client.callToAction.updateMany({ where: { schoolId, id, updatedAt: expectedUpdatedAt }, data: { ...input, updatedByUserId: actorUserId } });
    if (result.count !== 1) throw staleUpdate();
    return this.client.callToAction.findFirstOrThrow({ where: { schoolId, id } });
  }

  async setActive(schoolId: string, id: string, actorUserId: string, expectedUpdatedAt: Date, isActive: boolean) {
    return this.update(schoolId, id, actorUserId, expectedUpdatedAt, { isActive });
  }

  async reorder(schoolId: string, input: ReorderInput) {
    return prisma.$transaction(async (tx) => {
      const repository = new PrismaCallToActionRepository(tx);
      const current = await tx.callToAction.findMany({ where: { schoolId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
      assertCompleteOrder(current.map(({ id }) => id), input.ids);
      assertCollectionToken(current, input.expectedCollectionUpdatedAt);
      for (const [sortOrder, id] of input.ids.entries()) await tx.callToAction.updateMany({ where: { schoolId, id }, data: { sortOrder, updatedByUserId: input.actorUserId } });
      return repository.list(schoolId);
    });
  }
}
