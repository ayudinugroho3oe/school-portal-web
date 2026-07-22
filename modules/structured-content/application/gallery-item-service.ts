import type { Actor } from "@/lib/auth/permissions";
import { createCmsRequestContext, type SchoolContextResolver } from "@/modules/cms/application/context";
import { entityNotFound } from "@/modules/cms/domain/errors";
import type { MediaAssetRepository } from "@/modules/media/domain/repository";
import { PrismaGalleryAlbumRepository, PrismaGalleryItemRepository } from "../infrastructure/prisma-repositories";
import { requireUsableMedia } from "./media-policy";

export class GalleryItemService {
 constructor(private items:PrismaGalleryItemRepository,private albums:PrismaGalleryAlbumRepository,private media:MediaAssetRepository,private resolver:SchoolContextResolver){}
 private context(actor:Actor,requestId:string,permission:"cms.gallery.view"|"cms.gallery.create"|"cms.gallery.edit"|"cms.gallery.reorder"){return createCmsRequestContext(actor,permission,requestId,this.resolver);}
 async list(actor:Actor,r:string,albumId:string){const c=await this.context(actor,r,"cms.gallery.view");if(!await this.albums.findById(c.schoolId,albumId))throw entityNotFound();return this.items.list(c.schoolId,albumId);}
 async add(actor:Actor,r:string,albumId:string,input:{mediaId:string;caption?:string|null;sortOrder:number;isActive:boolean}){const c=await this.context(actor,r,"cms.gallery.create");if(!await this.albums.findById(c.schoolId,albumId))throw entityNotFound();await requireUsableMedia(this.media,c.schoolId,input.mediaId);return this.items.create(c.schoolId,albumId,input);}
 async update(actor:Actor,r:string,id:string,input:{caption?:string|null;sortOrder?:number;isActive?:boolean;expectedUpdatedAt:string}){const c=await this.context(actor,r,"cms.gallery.edit");const{expectedUpdatedAt,...changes}=input;return this.items.update(c.schoolId,id,new Date(expectedUpdatedAt),changes);}
 async reorder(actor:Actor,r:string,albumId:string,ids:readonly string[],token:string){const c=await this.context(actor,r,"cms.gallery.reorder");return this.items.reorder(c.schoolId,albumId,ids,new Date(token));}
}
