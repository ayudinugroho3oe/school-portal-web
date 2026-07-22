import type { ZodType } from "zod";
import { apiError, ok, requestId } from "@/lib/api";
import { getCurrentActor } from "@/lib/auth/session";
import type { Actor } from "@/lib/auth/permissions";
import { unauthenticated } from "@/modules/cms/domain/errors";
import { activeStateSchema, configurationIdSchema, reorderSchema } from "../validation/schemas";

type ConfigurationService<TCreate, TUpdate> = {
  list(actor: Actor, requestId: string): Promise<unknown>;
  create(actor: Actor, requestId: string, input: TCreate): Promise<unknown>;
  update(actor: Actor, requestId: string, id: string, input: TUpdate): Promise<unknown>;
  setActive(actor: Actor, requestId: string, id: string, isActive: boolean, expectedUpdatedAt: string): Promise<unknown>;
  reorder(actor: Actor, requestId: string, ids: readonly string[], expectedCollectionUpdatedAt: string): Promise<unknown>;
};

async function actorOrThrow() {
  const actor = await getCurrentActor();
  if (!actor) throw unauthenticated();
  return actor;
}

export async function listConfiguration<TCreate, TUpdate>(request: Request, service: ConfigurationService<TCreate, TUpdate>) {
  const id = requestId(request);
  try {
    return ok(await service.list(await actorOrThrow(), id), id);
  } catch (error) {
    return apiError(error, id);
  }
}

export async function createConfiguration<TCreate, TUpdate>(
  request: Request,
  service: ConfigurationService<TCreate, TUpdate>,
  schema: ZodType<TCreate>,
) {
  const id = requestId(request);
  try {
    const input = schema.parse(await request.json());
    return ok(await service.create(await actorOrThrow(), id, input), id, 201);
  } catch (error) {
    return apiError(error, id);
  }
}

export async function updateConfiguration<TCreate, TUpdate>(
  request: Request,
  rawId: string,
  service: ConfigurationService<TCreate, TUpdate>,
  updateSchema: ZodType<TUpdate>,
) {
  const requestIdentifier = requestId(request);
  try {
    const id = configurationIdSchema.parse(rawId);
    const body: unknown = await request.json();
    if (typeof body === "object" && body !== null && "isActive" in body) {
      const input = activeStateSchema.parse(body);
      return ok(await service.setActive(await actorOrThrow(), requestIdentifier, id, input.isActive, input.expectedUpdatedAt), requestIdentifier);
    }
    const input = updateSchema.parse(body);
    return ok(await service.update(await actorOrThrow(), requestIdentifier, id, input), requestIdentifier);
  } catch (error) {
    return apiError(error, requestIdentifier);
  }
}

export async function reorderConfiguration<TCreate, TUpdate>(request: Request, service: ConfigurationService<TCreate, TUpdate>) {
  const id = requestId(request);
  try {
    const input = reorderSchema.parse(await request.json());
    return ok(await service.reorder(await actorOrThrow(), id, input.ids, input.expectedCollectionUpdatedAt), id);
  } catch (error) {
    return apiError(error, id);
  }
}
