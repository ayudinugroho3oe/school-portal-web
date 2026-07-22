import { z } from "zod";

const timezone = z.string().trim().min(1).max(80).refine((value) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Invalid IANA timezone.");

export const provisionSchoolRootSchema = z.object({
  schoolCode: z.string().trim().min(2).max(20).transform((value) => value.toUpperCase()).pipe(
    z.string().regex(/^[A-Z0-9_-]+$/),
  ),
  schoolName: z.string().trim().min(1).max(150),
  isActive: z.literal(true).default(true),
  timezone: timezone.default("Asia/Jakarta"),
  locale: z.string().trim().regex(/^[a-z]{2}-[A-Z]{2}$/).default("id-ID"),
}).strict();

export type ProvisionSchoolRootInput = z.output<typeof provisionSchoolRootSchema>;
