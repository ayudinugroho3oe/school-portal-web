import type { Actor, Permission } from "@/lib/auth/permissions";
import { createCmsRequestContext, type SchoolContextResolver } from "@/modules/cms/application/context";
import { entityNotFound } from "@/modules/cms/domain/errors";
import type { ConfigurationRepository } from "../domain/repository";
import type { ConfigurationList } from "../domain/types";
import {
  contactChannelRegistry,
  type callToActionCreateSchema,
  type callToActionUpdateSchema,
  type contactChannelCreateSchema,
  type contactChannelUpdateSchema,
  type socialLinkCreateSchema,
  type socialLinkUpdateSchema,
} from "../validation/schemas";
import type { z } from "zod";

type CommonEntity = { id: string; schoolId: string; updatedAt: Date };
type UpdateWithToken<T> = T & { expectedUpdatedAt: string };

type ServicePermissions = {
  read: Permission;
  manage: Permission;
};

export class ConfigurationApplicationService<
  TEntity extends CommonEntity,
  TCreate,
  TUpdate extends Record<string, unknown>,
> {
  constructor(
    private readonly repository: ConfigurationRepository<TEntity, TCreate, TUpdate>,
    private readonly schoolResolver: SchoolContextResolver,
    private readonly permissions: ServicePermissions,
    private readonly validateUpdate?: (entity: TEntity, update: TUpdate) => void,
  ) {}

  async list(actor: Actor, requestId: string): Promise<ConfigurationList<TEntity>> {
    const context = await createCmsRequestContext(actor, this.permissions.read, requestId, this.schoolResolver);
    return this.repository.list(context.schoolId);
  }

  async create(actor: Actor, requestId: string, input: TCreate) {
    const context = await createCmsRequestContext(actor, this.permissions.manage, requestId, this.schoolResolver);
    return this.repository.create(context.schoolId, context.actor.id, input);
  }

  async update(actor: Actor, requestId: string, id: string, input: UpdateWithToken<TUpdate>) {
    const context = await createCmsRequestContext(actor, this.permissions.manage, requestId, this.schoolResolver);
    const { expectedUpdatedAt, ...changes } = input;
    const update = changes as unknown as TUpdate;
    const entity = await this.repository.findById(context.schoolId, id);
    if (!entity) throw entityNotFound();
    this.validateUpdate?.(entity, update);
    return this.repository.update(context.schoolId, id, context.actor.id, new Date(expectedUpdatedAt), update);
  }

  async setActive(actor: Actor, requestId: string, id: string, isActive: boolean, expectedUpdatedAt: string) {
    const context = await createCmsRequestContext(actor, this.permissions.manage, requestId, this.schoolResolver);
    return this.repository.setActive(context.schoolId, id, context.actor.id, new Date(expectedUpdatedAt), isActive);
  }

  async reorder(actor: Actor, requestId: string, ids: readonly string[], expectedCollectionUpdatedAt: string) {
    const context = await createCmsRequestContext(actor, this.permissions.manage, requestId, this.schoolResolver);
    return this.repository.reorder(context.schoolId, { ids, expectedCollectionUpdatedAt, actorUserId: context.actor.id });
  }
}

export type ContactChannelCreateInput = z.output<typeof contactChannelCreateSchema>;
export type ContactChannelUpdateInput = z.output<typeof contactChannelUpdateSchema>;
export type SocialLinkCreateInput = z.output<typeof socialLinkCreateSchema>;
export type SocialLinkUpdateInput = z.output<typeof socialLinkUpdateSchema>;
export type CallToActionCreateInput = z.output<typeof callToActionCreateSchema>;
export type CallToActionUpdateInput = z.output<typeof callToActionUpdateSchema>;

export function validateContactChannelUpdate(
  entity: { typeCode: string; value: string; url: string | null },
  update: { value?: string; url?: string | null },
) {
  contactChannelRegistry.parse(entity.typeCode, {
    value: update.value ?? entity.value,
    url: update.url === undefined ? entity.url : update.url,
  });
}
