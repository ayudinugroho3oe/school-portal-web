import type { SchoolId } from "@/modules/cms/domain/contracts";

export const publishableTypes=["PROGRAM","TEACHER_PROFILE","GALLERY_ALBUM","TESTIMONIAL"] as const;
export type PublishableType=(typeof publishableTypes)[number];
export type PublicationSnapshot=Readonly<{id:string;schoolId:SchoolId;entityType:PublishableType;entityId:string;version:number;payload:unknown;publishedAt:Date;sourceUpdatedAt:Date}>;
export interface PublishingRepository {
 publish(input:{schoolId:SchoolId;entityType:PublishableType;entityId:string;expectedUpdatedAt:Date;actorUserId:string;requestId:string}):Promise<PublicationSnapshot>;
 unpublish(input:{schoolId:SchoolId;entityType:PublishableType;entityId:string;expectedUpdatedAt:Date;actorUserId:string;requestId:string}):Promise<void>;
 status(schoolId:SchoolId,entityType:PublishableType,entityId:string):Promise<{status:string;current:PublicationSnapshot|null;hasUnpublishedChanges:boolean}>;
 listPublished(schoolId:SchoolId,entityType:PublishableType):Promise<readonly PublicationSnapshot[]>;
 readPublished(schoolId:SchoolId,entityType:PublishableType,entityId:string):Promise<PublicationSnapshot|null>;
}
