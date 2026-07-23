import type { Actor, Permission } from "@/lib/auth/permissions";
import { createCmsRequestContext, type SchoolContextResolver } from "@/modules/cms/application/context";
import type { SchoolContentRepository, SingletonKind } from "../domain/contracts";
import type { SchoolIdentityUpdate, SchoolProfileUpdate } from "../validation/schemas";

const permission = (kind: SingletonKind, action: "view" | "edit") => `cms.${kind}.${action}` as Permission;
export class SchoolContentService {
  constructor(private repository: SchoolContentRepository, private resolver: SchoolContextResolver) {}
  async read(actor: Actor, requestId: string, kind: SingletonKind) {
    const context = await createCmsRequestContext(actor, permission(kind, "view"), requestId, this.resolver);
    return this.repository.read(kind, context.schoolId);
  }
  async updateIdentity(actor: Actor, requestId: string, input: SchoolIdentityUpdate) {
    const context = await createCmsRequestContext(actor, permission("identity", "edit"), requestId, this.resolver);
    return this.repository.updateIdentity(context.schoolId, actor.id, requestId, input);
  }
  async updateProfile(actor: Actor, requestId: string, input: SchoolProfileUpdate) {
    const context = await createCmsRequestContext(actor, permission("profile", "edit"), requestId, this.resolver);
    return this.repository.updateProfile(context.schoolId, actor.id, requestId, input);
  }
}
