import { z, type ZodType } from "zod";
import { apiError, ok, requestId } from "@/lib/api";
import { getCurrentActor } from "@/lib/auth/session";
import { can, type Permission } from "@/lib/auth/permissions";
import { entityNotFound, forbidden, unauthenticated } from "@/modules/cms/domain/errors";
import { publicPublishingService, publishingService } from "@/modules/publishing/application/services";
import type { PublishableType } from "@/modules/publishing/domain/contracts";
import { schoolContentService } from "../application/services";
import type { SingletonKind } from "../domain/contracts";

const typeFor = (kind: SingletonKind): PublishableType => kind === "identity" ? "SCHOOL_IDENTITY" : "SCHOOL_PROFILE";
const actionSchema=z.strictObject({expectedUpdatedAt:z.string().datetime({offset:true})});
async function actor() { const value = await getCurrentActor(); if (!value) throw unauthenticated(); return value; }
export async function cmsSingletonRead(req: Request, kind: SingletonKind) { const id = requestId(req); try { const data = await schoolContentService.read(await actor(), id, kind); if (!data) throw entityNotFound(); return ok(data, id); } catch (error) { return apiError(error, id); } }
export async function cmsSingletonUpdate(req: Request, kind: SingletonKind, schema: ZodType) { const id = requestId(req); try { const input = schema.parse(await req.json()); const data = kind === "identity" ? await schoolContentService.updateIdentity(await actor(), id, input as never) : await schoolContentService.updateProfile(await actor(), id, input as never); return ok(data, id); } catch (error) { return apiError(error, id); } }
export async function cmsSingletonLifecycle(req: Request, kind: SingletonKind, action: "publish" | "unpublish" | "status") { const id = requestId(req); try { const currentActor = await actor(); const permission=`cms.${kind}.${action==="unpublish"?"archive":action==="status"?"view":"publish"}` as Permission; if(!can(currentActor.role,permission))throw forbidden(); const working = await schoolContentService.read(currentActor, id, kind) as { id: string } | null; if (!working) throw entityNotFound(); if (action === "status") return ok(await publishingService.status(currentActor, id, typeFor(kind), working.id), id); const body = actionSchema.parse(await req.json()); if (action === "publish") return ok(await publishingService.publish(currentActor, id, typeFor(kind), working.id, body.expectedUpdatedAt), id); await publishingService.unpublish(currentActor, id, typeFor(kind), working.id, body.expectedUpdatedAt); return ok({ unpublished: true }, id); } catch (error) { return apiError(error, id); } }
export async function publicSingletonRead(req: Request, kind: SingletonKind) { const id = requestId(req); try { const snapshots = await publicPublishingService.list(typeFor(kind)); const snapshot = snapshots[0]; if (!snapshot) throw entityNotFound(); return ok(snapshot, id); } catch (error) { return apiError(error, id); } }
