import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { duplicateCode, entityNotFound, staleUpdate } from "@/modules/cms/domain/errors";

async function failure(exists:boolean):Promise<never>{ if(!exists) throw entityNotFound(); throw staleUpdate(); }
function duplicate(error:unknown):never { if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002") throw duplicateCode(); throw error; }
function assertOrder<T extends {id:string;updatedAt:Date}>(items:T[],ids:readonly string[],token:Date){ if(items.length!==ids.length||items.some((x)=>!ids.includes(x.id))) throw entityNotFound(); const latest=items.reduce((a,b)=>a.updatedAt>b.updatedAt?a:b).updatedAt; if(latest.getTime()!==token.getTime()) throw staleUpdate(); }

export class PrismaProgramRepository {
 list(schoolId:string){return prisma.program.findMany({where:{schoolId},orderBy:[{sortOrder:"asc"},{id:"asc"}]});}
 findById(schoolId:string,id:string){return prisma.program.findFirst({where:{schoolId,id}});}
 async create(schoolId:string,input:Omit<Prisma.ProgramUncheckedCreateInput,"schoolId">){try{return await prisma.program.create({data:{...input,schoolId}});}catch(e){duplicate(e);}}
 async update(schoolId:string,id:string,t:Date,input:Prisma.ProgramUncheckedUpdateInput){const r=await prisma.program.updateMany({where:{schoolId,id,updatedAt:t},data:input});if(!r.count)await failure(!!await this.findById(schoolId,id));return (await this.findById(schoolId,id))!;}
 setActive(s:string,id:string,t:Date,a:boolean){return this.update(s,id,t,{isActive:a});}
 async reorder(s:string,ids:readonly string[],t:Date){return prisma.$transaction(async tx=>{const items=await tx.program.findMany({where:{schoolId:s}});assertOrder(items,ids,t);for(const [sortOrder,id] of ids.entries())await tx.program.update({where:{id},data:{sortOrder}});return tx.program.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});});}
}
export class PrismaTeacherRepository {
 list(schoolId:string){return prisma.teacherProfile.findMany({where:{schoolId},orderBy:[{sortOrder:"asc"},{id:"asc"}]});} findById(s:string,id:string){return prisma.teacherProfile.findFirst({where:{schoolId:s,id}});}
 async create(s:string,input:Omit<Prisma.TeacherProfileUncheckedCreateInput,"schoolId">){return prisma.teacherProfile.create({data:{...input,schoolId:s}});}
 async update(s:string,id:string,t:Date,input:Prisma.TeacherProfileUncheckedUpdateInput){const r=await prisma.teacherProfile.updateMany({where:{schoolId:s,id,updatedAt:t},data:input});if(!r.count)await failure(!!await this.findById(s,id));return(await this.findById(s,id))!;} setActive(s:string,id:string,t:Date,a:boolean){return this.update(s,id,t,{isActive:a});}
 async reorder(s:string,ids:readonly string[],t:Date){return prisma.$transaction(async tx=>{const x=await tx.teacherProfile.findMany({where:{schoolId:s}});assertOrder(x,ids,t);for(const[o,id]of ids.entries())await tx.teacherProfile.update({where:{id},data:{sortOrder:o}});return tx.teacherProfile.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});});}
}
export class PrismaGalleryAlbumRepository {
 list(s:string){return prisma.galleryAlbum.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});} findById(s:string,id:string){return prisma.galleryAlbum.findFirst({where:{schoolId:s,id}});}
 async create(s:string,input:Omit<Prisma.GalleryAlbumUncheckedCreateInput,"schoolId">){try{return await prisma.galleryAlbum.create({data:{...input,schoolId:s}});}catch(e){duplicate(e);}}
 async update(s:string,id:string,t:Date,input:Prisma.GalleryAlbumUncheckedUpdateInput){const r=await prisma.galleryAlbum.updateMany({where:{schoolId:s,id,updatedAt:t},data:input});if(!r.count)await failure(!!await this.findById(s,id));return(await this.findById(s,id))!;} setActive(s:string,id:string,t:Date,a:boolean){return this.update(s,id,t,{isActive:a});}
 async reorder(s:string,ids:readonly string[],t:Date){return prisma.$transaction(async tx=>{const x=await tx.galleryAlbum.findMany({where:{schoolId:s}});assertOrder(x,ids,t);for(const[o,id]of ids.entries())await tx.galleryAlbum.update({where:{id},data:{sortOrder:o}});return tx.galleryAlbum.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});});}
}
export class PrismaTestimonialRepository {
 list(s:string){return prisma.testimonial.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});} findById(s:string,id:string){return prisma.testimonial.findFirst({where:{schoolId:s,id}});}
 async create(s:string,input:Omit<Prisma.TestimonialUncheckedCreateInput,"schoolId">){return prisma.testimonial.create({data:{...input,schoolId:s}});}
 async update(s:string,id:string,t:Date,input:Prisma.TestimonialUncheckedUpdateInput){const r=await prisma.testimonial.updateMany({where:{schoolId:s,id,updatedAt:t},data:input});if(!r.count)await failure(!!await this.findById(s,id));return(await this.findById(s,id))!;} setActive(s:string,id:string,t:Date,a:boolean){return this.update(s,id,t,{isActive:a});}
 async reorder(s:string,ids:readonly string[],t:Date){return prisma.$transaction(async tx=>{const x=await tx.testimonial.findMany({where:{schoolId:s}});assertOrder(x,ids,t);for(const[o,id]of ids.entries())await tx.testimonial.update({where:{id},data:{sortOrder:o}});return tx.testimonial.findMany({where:{schoolId:s},orderBy:[{sortOrder:"asc"},{id:"asc"}]});});}
}

export class PrismaGalleryItemRepository {
 list(s:string,albumId:string){return prisma.galleryItem.findMany({where:{schoolId:s,albumId},orderBy:[{sortOrder:"asc"},{id:"asc"}]});}
 findById(s:string,id:string){return prisma.galleryItem.findFirst({where:{schoolId:s,id}});}
 async create(s:string,albumId:string,input:Omit<Prisma.GalleryItemUncheckedCreateInput,"schoolId"|"albumId">){try{return await prisma.galleryItem.create({data:{...input,schoolId:s,albumId}});}catch(e){duplicate(e);}}
 async update(s:string,id:string,t:Date,input:Prisma.GalleryItemUncheckedUpdateInput){const r=await prisma.galleryItem.updateMany({where:{schoolId:s,id,updatedAt:t},data:input});if(!r.count)await failure(!!await this.findById(s,id));return(await this.findById(s,id))!;}
 async reorder(s:string,albumId:string,ids:readonly string[],t:Date){return prisma.$transaction(async tx=>{const x=await tx.galleryItem.findMany({where:{schoolId:s,albumId}});assertOrder(x,ids,t);for(const[o,id]of ids.entries())await tx.galleryItem.update({where:{id},data:{sortOrder:o}});return tx.galleryItem.findMany({where:{schoolId:s,albumId},orderBy:[{sortOrder:"asc"},{id:"asc"}]});});}
}
