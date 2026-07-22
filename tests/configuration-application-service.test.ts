import { describe, expect, it, vi } from "vitest";
import { ConfigurationApplicationService } from "@/modules/configuration/application/service";
import type { ConfigurationRepository } from "@/modules/configuration/domain/repository";

type Entity = { id: string; schoolId: string; createdAt: Date; updatedAt: Date; label: string };
type Create = { label: string };
type Update = { label?: string };

const repository = (): ConfigurationRepository<Entity, Create, Update> => ({
  list: vi.fn(async () => ({ items: [], collectionUpdatedAt: null })),
  findById: vi.fn(async () => null),
  create: vi.fn(async (schoolId, _actorId, input) => ({ id: crypto.randomUUID(), schoolId, createdAt: new Date(), updatedAt: new Date(), ...input })),
  update: vi.fn(async () => { throw new Error("not used"); }),
  setActive: vi.fn(async () => { throw new Error("not used"); }),
  reorder: vi.fn(async () => ({ items: [], collectionUpdatedAt: null })),
});

describe("Configuration application authorization boundary", () => {
  it("denies before School resolution and repository access", async () => {
    const repo = repository();
    const resolver = { resolveActiveSchoolId: vi.fn(async () => crypto.randomUUID()) };
    const service = new ConfigurationApplicationService(repo, resolver, { read: "cms.configuration.read", manage: "cms.cta.manage" });
    await expect(service.create({ id: crypto.randomUUID(), role: "STAFF" }, "denied", { label: "No" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(resolver.resolveActiveSchoolId).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("uses only the School returned by the server resolver", async () => {
    const repo = repository();
    const schoolId = crypto.randomUUID();
    const actor = { id: crypto.randomUUID(), role: "SCHOOL_ADMIN" as const };
    const service = new ConfigurationApplicationService(repo, { resolveActiveSchoolId: async () => schoolId }, { read: "cms.configuration.read", manage: "cms.cta.manage" });
    await service.create(actor, "allowed", { label: "Safe" });
    expect(repo.create).toHaveBeenCalledWith(schoolId, actor.id, { label: "Safe" });
  });
});
