import type{ZodType}from"zod";
import{z}from"zod";
import{apiError,ok,requestId}from"@/lib/api";
import{getCurrentActor}from"@/lib/auth/session";
import type{Actor}from"@/lib/auth/permissions";
import{entityNotFound,unauthenticated}from"@/modules/cms/domain/errors";
import type{PublishableType}from"../domain/contracts";
import{publicPublishingService,publishingService}from"../application/services";

const actionSchema=z.strictObject({expectedUpdatedAt:z.string().datetime({offset:true})});
const orderSchema=z.strictObject({ids:z.array(z.string().uuid()).min(1),expectedCollectionUpdatedAt:z.string().datetime({offset:true})});
type CrudService={list(a:Actor,r:string):Promise<unknown>;read(a:Actor,r:string,id:string):Promise<unknown>;create(a:Actor,r:string,i:never):Promise<unknown>;update(a:Actor,r:string,id:string,i:never):Promise<unknown>;reorder(a:Actor,r:string,ids:readonly string[],t:string):Promise<unknown>};
async function actor(){const a=await getCurrentActor();if(!a)throw unauthenticated();return a;}
export async function cmsList(req:Request,s:CrudService){const r=requestId(req);try{return ok(await s.list(await actor(),r),r)}catch(e){return apiError(e,r)}}
export async function cmsCreate(req:Request,s:CrudService,schema:ZodType){const r=requestId(req);try{return ok(await s.create(await actor(),r,schema.parse(await req.json()) as never),r,201)}catch(e){return apiError(e,r)}}
export async function cmsRead(req:Request,id:string,s:CrudService){const r=requestId(req);try{return ok(await s.read(await actor(),r,z.string().uuid().parse(id)),r)}catch(e){return apiError(e,r)}}
export async function cmsUpdate(req:Request,id:string,s:CrudService,schema:ZodType){const r=requestId(req);try{return ok(await s.update(await actor(),r,z.string().uuid().parse(id),schema.parse(await req.json()) as never),r)}catch(e){return apiError(e,r)}}
export async function cmsOrder(req:Request,s:CrudService){const r=requestId(req);try{const i=orderSchema.parse(await req.json());return ok(await s.reorder(await actor(),r,i.ids,i.expectedCollectionUpdatedAt),r)}catch(e){return apiError(e,r)}}
export async function lifecycle(req:Request,id:string,type:PublishableType,action:"publish"|"unpublish"|"status"){const r=requestId(req);try{const a=await actor();const entityId=z.string().uuid().parse(id);if(action==="status")return ok(await publishingService.status(a,r,type,entityId),r);const body=actionSchema.parse(await req.json());if(action==="publish")return ok(await publishingService.publish(a,r,type,entityId,body.expectedUpdatedAt),r);await publishingService.unpublish(a,r,type,entityId,body.expectedUpdatedAt);return ok({unpublished:true},r)}catch(e){return apiError(e,r)}}
export async function publicList(req:Request,type:PublishableType){const r=requestId(req);try{return ok(await publicPublishingService.list(type),r)}catch(e){return apiError(e,r)}}
export async function publicRead(req:Request,id:string,type:PublishableType){const r=requestId(req);try{const p=await publicPublishingService.read(type,z.string().uuid().parse(id));if(!p)throw entityNotFound();return ok(p,r)}catch(e){return apiError(e,r)}}
