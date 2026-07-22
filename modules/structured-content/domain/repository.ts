import type { SchoolId } from "@/modules/cms/domain/contracts";

export type StructuredEntity = { id:string; schoolId:string; sortOrder:number; isActive:boolean; updatedAt:Date };
export interface StructuredRepository<TEntity extends StructuredEntity, TCreate, TUpdate> {
  list(schoolId:SchoolId):Promise<readonly TEntity[]>;
  findById(schoolId:SchoolId,id:string):Promise<TEntity|null>;
  create(schoolId:SchoolId,input:TCreate):Promise<TEntity>;
  update(schoolId:SchoolId,id:string,expectedUpdatedAt:Date,input:TUpdate):Promise<TEntity>;
  setActive(schoolId:SchoolId,id:string,expectedUpdatedAt:Date,isActive:boolean):Promise<TEntity>;
  reorder(schoolId:SchoolId,ids:readonly string[],expectedCollectionUpdatedAt:Date):Promise<readonly TEntity[]>;
}
