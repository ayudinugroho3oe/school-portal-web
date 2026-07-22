import type { Actor, Permission } from "@/lib/auth/permissions";
import { createCmsRequestContext, type SchoolContextResolver } from "@/modules/cms/application/context";
import { entityNotFound } from "@/modules/cms/domain/errors";
import type { StructuredEntity, StructuredRepository } from "../domain/repository";

type Permissions = { view:Permission; create:Permission; edit:Permission; reorder:Permission };

export class StructuredContentService<TEntity extends StructuredEntity,TCreate,TUpdate extends Record<string,unknown>> {
  constructor(private repository:StructuredRepository<TEntity,TCreate,TUpdate>,private resolver:SchoolContextResolver,private permissions:Permissions,private validateRelations?:(schoolId:string,input:TCreate|TUpdate)=>Promise<void>) {}
  async list(actor:Actor,requestId:string) { const c=await createCmsRequestContext(actor,this.permissions.view,requestId,this.resolver); return this.repository.list(c.schoolId); }
  async read(actor:Actor,requestId:string,id:string) { const c=await createCmsRequestContext(actor,this.permissions.view,requestId,this.resolver); const item=await this.repository.findById(c.schoolId,id); if(!item) throw entityNotFound(); return item; }
  async create(actor:Actor,requestId:string,input:TCreate) { const c=await createCmsRequestContext(actor,this.permissions.create,requestId,this.resolver); await this.validateRelations?.(c.schoolId,input); return this.repository.create(c.schoolId,input); }
  async update(actor:Actor,requestId:string,id:string,input:TUpdate&{expectedUpdatedAt:string}) { const c=await createCmsRequestContext(actor,this.permissions.edit,requestId,this.resolver); const {expectedUpdatedAt,...changes}=input; const update=changes as unknown as TUpdate; await this.validateRelations?.(c.schoolId,update); return this.repository.update(c.schoolId,id,new Date(expectedUpdatedAt),update); }
  async setActive(actor:Actor,requestId:string,id:string,isActive:boolean,expectedUpdatedAt:string) { const c=await createCmsRequestContext(actor,this.permissions.edit,requestId,this.resolver); return this.repository.setActive(c.schoolId,id,new Date(expectedUpdatedAt),isActive); }
  async reorder(actor:Actor,requestId:string,ids:readonly string[],expectedCollectionUpdatedAt:string) { const c=await createCmsRequestContext(actor,this.permissions.reorder,requestId,this.resolver); return this.repository.reorder(c.schoolId,ids,new Date(expectedCollectionUpdatedAt)); }
}
