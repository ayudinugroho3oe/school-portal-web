import { can, type Actor, type Permission } from "@/lib/auth/permissions";
import type { SchoolId } from "../domain/contracts";
import { forbidden } from "../domain/errors";

export type CmsRequestContext = Readonly<{
  actor: Actor;
  schoolId: SchoolId;
  requestId: string;
}>;

export interface SchoolContextResolver {
  resolveActiveSchoolId(): Promise<SchoolId>;
}

export async function createCmsRequestContext(
  actor: Actor,
  permission: Permission,
  requestId: string,
  resolver: SchoolContextResolver,
): Promise<CmsRequestContext> {
  if (!can(actor.role, permission)) throw forbidden();
  const schoolId = await resolver.resolveActiveSchoolId();
  return Object.freeze({ actor: Object.freeze({ ...actor }), schoolId, requestId });
}
