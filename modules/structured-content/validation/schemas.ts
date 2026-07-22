import { z } from "zod";

const unsafe = /<\s*\/?\s*(?:script|iframe|object|embed|style)|javascript:|data:text\/html/i;
const text = (min: number, max: number) => z.string().trim().min(min).max(max).refine((value) => !unsafe.test(value), "Executable or unsafe HTML is not allowed.");
const optionalText = (max: number) => z.string().trim().max(max).refine((value) => !unsafe.test(value), "Executable or unsafe HTML is not allowed.").nullable().optional();
const common = { sortOrder: z.number().int().min(0).max(100000).default(0), isActive: z.boolean().default(true) };
const mediaId = z.string().uuid().nullable().optional();
const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const code = z.string().trim().min(2).max(64).regex(/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/);
const token = z.string().datetime({ offset: true });

export const programCreateSchema = z.strictObject({ code, title: text(1,120), slug, summary: text(1,300), description: text(1,10000), featuredMediaId: mediaId, ...common });
export const programUpdateSchema = programCreateSchema.partial().extend({ expectedUpdatedAt: token });
export const teacherCreateSchema = z.strictObject({ name:text(1,120), position:optionalText(120), biography:optionalText(2000), qualification:optionalText(200), photoMediaId:mediaId, ...common });
export const teacherUpdateSchema = teacherCreateSchema.partial().extend({ expectedUpdatedAt:token });
export const galleryAlbumCreateSchema = z.strictObject({ title:text(1,150), slug, description:optionalText(2000), coverMediaId:mediaId, ...common });
export const galleryAlbumUpdateSchema = galleryAlbumCreateSchema.partial().extend({ expectedUpdatedAt:token });
export const galleryItemCreateSchema = z.strictObject({ mediaId:z.string().uuid(), caption:optionalText(500), ...common });
export const galleryItemUpdateSchema = z.strictObject({ caption:optionalText(500), sortOrder:z.number().int().min(0).max(100000).optional(), isActive:z.boolean().optional(), expectedUpdatedAt:token });
export const testimonialCreateSchema = z.strictObject({ authorName:text(1,120), authorRole:optionalText(120), quote:text(1,2000), avatarMediaId:mediaId, ...common });
export const testimonialUpdateSchema = testimonialCreateSchema.partial().extend({ expectedUpdatedAt:token });
export const structuredIdSchema = z.string().uuid();
export const reorderSchema = z.strictObject({ ids:z.array(z.string().uuid()).min(1).max(500).refine((ids) => new Set(ids).size === ids.length), expectedCollectionUpdatedAt:token });
