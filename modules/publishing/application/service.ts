import type{Actor,Permission}from"@/lib/auth/permissions";
import{createCmsRequestContext,type SchoolContextResolver}from"@/modules/cms/application/context";
import type{PublishableType,PublishingRepository}from"../domain/contracts";

const domains:Record<PublishableType,"program"|"teacher"|"gallery"|"testimonial"|"identity"|"profile">={PROGRAM:"program",TEACHER_PROFILE:"teacher",GALLERY_ALBUM:"gallery",TESTIMONIAL:"testimonial",SCHOOL_IDENTITY:"identity",SCHOOL_PROFILE:"profile"};
const domain=(type:PublishableType)=>domains[type];
export class PublishingApplicationService{
 constructor(private repository:PublishingRepository,private resolver:SchoolContextResolver){}
 private permission(type:PublishableType,action:"view"|"publish"|"archive"){return `cms.${domain(type)}.${action}` as Permission;}
 async publish(actor:Actor,requestId:string,type:PublishableType,id:string,expectedUpdatedAt:string){const c=await createCmsRequestContext(actor,this.permission(type,"publish"),requestId,this.resolver);return this.repository.publish({schoolId:c.schoolId,entityType:type,entityId:id,expectedUpdatedAt:new Date(expectedUpdatedAt),actorUserId:c.actor.id,requestId});}
 async unpublish(actor:Actor,requestId:string,type:PublishableType,id:string,expectedUpdatedAt:string){const c=await createCmsRequestContext(actor,this.permission(type,"archive"),requestId,this.resolver);await this.repository.unpublish({schoolId:c.schoolId,entityType:type,entityId:id,expectedUpdatedAt:new Date(expectedUpdatedAt),actorUserId:c.actor.id,requestId});}
 async status(actor:Actor,requestId:string,type:PublishableType,id:string){const c=await createCmsRequestContext(actor,this.permission(type,"view"),requestId,this.resolver);return this.repository.status(c.schoolId,type,id);}
}

export class PublicPublishingService{
 constructor(private repository:PublishingRepository,private resolver:SchoolContextResolver){}
 async list(type:PublishableType){const schoolId=await this.resolver.resolveActiveSchoolId();return this.repository.listPublished(schoolId,type);}
 async read(type:PublishableType,id:string){const schoolId=await this.resolver.resolveActiveSchoolId();return this.repository.readPublished(schoolId,type,id);}
}
