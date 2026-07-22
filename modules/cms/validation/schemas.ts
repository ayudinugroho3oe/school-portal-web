import { z } from "zod";

const unsafeStructuredText = /<script\b|\bon[a-z]+\s*=|javascript\s*:|data\s*:/i;

export const entityIdSchema = z.uuid();
export const schoolIdSchema = z.uuid();
export const configurationCodeSchema = z.string().trim().min(2).max(64).transform((value) => value.toUpperCase()).pipe(
  z.string().regex(/^[A-Z0-9][A-Z0-9_-]*$/),
);
export const iconKeySchema = z.string().trim().min(1).max(64).regex(/^[a-z0-9][a-z0-9-]*$/);
export const sortOrderSchema = z.int().min(0).max(10_000);
export const expectedUpdatedAtSchema = z.iso.datetime({ offset: true });
export const structuredTextSchema = (maximum: number) => z.string().trim().max(maximum).refine(
  (value) => !unsafeStructuredText.test(value),
  "Executable or unsafe content is not allowed.",
);
export const safeLinkSchema = z.string().trim().max(500).refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "Use a safe local path or approved URL protocol.");

export const configurationBaseSchema = z.object({
  code: configurationCodeSchema,
  label: z.string().trim().min(1).max(120),
  iconKey: iconKeySchema.nullable().optional(),
  sortOrder: sortOrderSchema.default(0),
  isVisible: z.boolean().default(true),
}).strict();

export const optimisticUpdateSchema = z.object({ expectedUpdatedAt: expectedUpdatedAtSchema }).strict();
