import type { z } from "zod";
import { CanonicalSchoolContextResolver } from "@/modules/cms/infrastructure/school-context-resolver";
import { PrismaMediaAssetRepository } from "@/modules/media/infrastructure/prisma-repository";
import { PrismaGalleryAlbumRepository, PrismaGalleryItemRepository, PrismaProgramRepository, PrismaTeacherRepository, PrismaTestimonialRepository } from "../infrastructure/prisma-repositories";
import { galleryAlbumCreateSchema, galleryAlbumUpdateSchema, programCreateSchema, programUpdateSchema, teacherCreateSchema, teacherUpdateSchema, testimonialCreateSchema, testimonialUpdateSchema } from "../validation/schemas";
import { requireUsableMedia } from "./media-policy";
import { StructuredContentService } from "./service";
import { GalleryItemService } from "./gallery-item-service";

const resolver=new CanonicalSchoolContextResolver(); const media=new PrismaMediaAssetRepository();
const mediaRule=(field:"featuredMediaId"|"photoMediaId"|"coverMediaId"|"avatarMediaId")=>(schoolId:string,input:Record<string,unknown>)=>requireUsableMedia(media,schoolId,input[field] as string|null|undefined);

export const programService=new StructuredContentService(new PrismaProgramRepository(),resolver,{view:"cms.program.view",create:"cms.program.create",edit:"cms.program.edit",reorder:"cms.program.reorder"},mediaRule("featuredMediaId"));
export const teacherService=new StructuredContentService(new PrismaTeacherRepository(),resolver,{view:"cms.teacher.view",create:"cms.teacher.create",edit:"cms.teacher.edit",reorder:"cms.teacher.reorder"},mediaRule("photoMediaId"));
export const galleryAlbumService=new StructuredContentService(new PrismaGalleryAlbumRepository(),resolver,{view:"cms.gallery.view",create:"cms.gallery.create",edit:"cms.gallery.edit",reorder:"cms.gallery.reorder"},mediaRule("coverMediaId"));
export const testimonialService=new StructuredContentService(new PrismaTestimonialRepository(),resolver,{view:"cms.testimonial.view",create:"cms.testimonial.create",edit:"cms.testimonial.edit",reorder:"cms.testimonial.reorder"},mediaRule("avatarMediaId"));
export const galleryItemService=new GalleryItemService(new PrismaGalleryItemRepository(),new PrismaGalleryAlbumRepository(),media,resolver);

export type ProgramCreate=z.output<typeof programCreateSchema>; export type ProgramUpdate=z.output<typeof programUpdateSchema>;
export type TeacherCreate=z.output<typeof teacherCreateSchema>; export type TeacherUpdate=z.output<typeof teacherUpdateSchema>;
export type GalleryAlbumCreate=z.output<typeof galleryAlbumCreateSchema>; export type GalleryAlbumUpdate=z.output<typeof galleryAlbumUpdateSchema>;
export type TestimonialCreate=z.output<typeof testimonialCreateSchema>; export type TestimonialUpdate=z.output<typeof testimonialUpdateSchema>;
