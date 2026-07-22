import { z } from "zod";
import { ConfigurationRegistry } from "@/modules/cms/configuration/registry";
import {
  configurationCodeSchema,
  entityIdSchema,
  expectedUpdatedAtSchema,
  safeLinkSchema,
  sortOrderSchema,
  structuredTextSchema,
} from "@/modules/cms/validation/schemas";

const nullableSafeLinkValue = z.union([safeLinkSchema, z.literal("").transform(() => null), z.null()]);
const nullableSafeLink = nullableSafeLinkValue.optional().transform((value) => value ?? null);
const phoneValue = z.string().transform((value) => value.replace(/[^\d+]/g, "")).pipe(z.string().min(8).max(16));
const whatsappValue = z.string().transform((value) => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}).pipe(z.string().min(10).max(15));

export const contactChannelRegistry = new ConfigurationRegistry([
  { code: "WHATSAPP", schema: z.object({ value: whatsappValue, url: nullableSafeLink }).strict() },
  { code: "PHONE", schema: z.object({ value: phoneValue, url: nullableSafeLink }).strict() },
  { code: "EMAIL", schema: z.object({ value: z.email().max(254), url: nullableSafeLink }).strict() },
  { code: "ADDRESS", schema: z.object({ value: structuredTextSchema(500).min(1), url: nullableSafeLink }).strict() },
  { code: "GOOGLE_MAPS", schema: z.object({ value: structuredTextSchema(200).min(1), url: safeLinkSchema }).strict() },
]);

export const socialPlatformRegistry = new ConfigurationRegistry([
  { code: "INSTAGRAM", schema: z.object({ url: safeLinkSchema }).strict() },
  { code: "FACEBOOK", schema: z.object({ url: safeLinkSchema }).strict() },
  { code: "YOUTUBE", schema: z.object({ url: safeLinkSchema }).strict() },
  { code: "TIKTOK", schema: z.object({ url: safeLinkSchema }).strict() },
]);

const label = z.string().trim().min(1).max(120);
const baseOrderAndState = { sortOrder: sortOrderSchema.default(0), isActive: z.boolean().default(true) };

export const contactChannelCreateSchema = z.object({
  typeCode: configurationCodeSchema,
  label,
  value: z.string().trim().min(1).max(500),
  url: nullableSafeLink,
  ...baseOrderAndState,
}).strict().transform((input) => {
  const result = contactChannelRegistry.parse<{ value: string; url: string | null }>(input.typeCode, { value: input.value, url: input.url });
  return { ...input, ...result };
});

export const contactChannelUpdateSchema = z.object({
  label: label.optional(),
  value: z.string().trim().min(1).max(500).optional(),
  url: nullableSafeLinkValue.optional(),
  sortOrder: sortOrderSchema.optional(),
  expectedUpdatedAt: expectedUpdatedAtSchema,
}).strict();

export const socialLinkCreateSchema = z.object({
  platformCode: configurationCodeSchema,
  label,
  url: safeLinkSchema,
  ...baseOrderAndState,
}).strict().transform((input) => ({ ...input, ...socialPlatformRegistry.parse<{ url: string }>(input.platformCode, { url: input.url }) }));

export const socialLinkUpdateSchema = z.object({
  label: label.optional(),
  url: safeLinkSchema.optional(),
  sortOrder: sortOrderSchema.optional(),
  expectedUpdatedAt: expectedUpdatedAtSchema,
}).strict();

export const callToActionCreateSchema = z.object({
  code: configurationCodeSchema,
  label,
  targetUrl: safeLinkSchema,
  description: structuredTextSchema(500).transform((value) => value || null).nullable().optional(),
  ...baseOrderAndState,
}).strict();

export const callToActionUpdateSchema = z.object({
  label: label.optional(),
  targetUrl: safeLinkSchema.optional(),
  description: structuredTextSchema(500).transform((value) => value || null).nullable().optional(),
  sortOrder: sortOrderSchema.optional(),
  expectedUpdatedAt: expectedUpdatedAtSchema,
}).strict();

export const activeStateSchema = z.object({ isActive: z.boolean(), expectedUpdatedAt: expectedUpdatedAtSchema }).strict();
export const configurationIdSchema = entityIdSchema;
export const reorderSchema = z.object({
  ids: z.array(entityIdSchema).min(1).max(500).refine((ids) => new Set(ids).size === ids.length, "IDs must be unique."),
  expectedCollectionUpdatedAt: expectedUpdatedAtSchema,
}).strict();
