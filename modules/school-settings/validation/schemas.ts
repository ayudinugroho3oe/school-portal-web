import { z } from "zod";
import { ownershipStatuses, schoolLevels } from "../domain/constants";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).transform((v) => v || null).nullable().optional();
const optionalUrl = z.string().trim().max(500).transform((v) => v || null).nullable().optional().refine(
  (v) => !v || v.startsWith("/") || /^https?:\/\//i.test(v), "Use a local path or an HTTP(S) URL.",
);
const phone = (required = false) => z.string().transform((v) => v.replace(/\D/g, "")).pipe(
  required ? z.string().min(10).max(15) : z.string().max(15),
);
const whatsapp = z.string().transform((v) => {
  const digits = v.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}).pipe(z.string().min(10).max(15)).nullable().optional();
const timezone = text(80).refine((value) => {
  try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return false; }
}, "Invalid IANA timezone.");

export const schoolFields = {
  schoolCode: text(20).transform((v) => v.toUpperCase()).pipe(z.string().min(2).regex(/^[A-Z0-9_-]+$/)),
  isActive: z.boolean().default(true),
  schoolName: text(150), shortName: optionalText(50), npsn: z.string().trim().regex(/^\d{8}$/).nullable().optional().or(z.literal("").transform(() => null)),
  schoolLevel: z.preprocess((v) => v === "" ? null : v, z.enum(schoolLevels).nullable().optional()), ownershipStatus: z.preprocess((v) => v === "" ? null : v, z.enum(ownershipStatuses).nullable().optional()), foundationName: optionalText(200),
  principalName: optionalText(120), principalPhotoUrl: optionalUrl, principalWelcome: optionalText(5000), operationalPermitNumber: optionalText(100), accreditation: optionalText(20),
  email: z.string().trim().email().max(254).nullable().optional().or(z.literal("").transform(() => null)),
  phone: phone().transform((v) => v || null).nullable().optional(), whatsapp,
  websiteUrl: optionalUrl, addressLine: optionalText(250), village: optionalText(100), district: optionalText(100),
  city: optionalText(100), province: optionalText(100), postalCode: z.string().trim().regex(/^\d{5}$/).nullable().optional().or(z.literal("").transform(() => null)),
  timezone: timezone.default("Asia/Jakarta"), locale: z.string().trim().regex(/^[a-z]{2}-[A-Z]{2}$/).default("id-ID"), academicYearLabel: z.string().trim().regex(/^\d{4}\/\d{4}$/).nullable().optional().or(z.literal("").transform(() => null)),
  logoUrl: optionalUrl, logoDarkUrl: optionalUrl, faviconUrl: optionalUrl, heroImageUrl: optionalUrl, buildingImageUrl: optionalUrl,
  schoolMotto: optionalText(250), history: optionalText(10000), vision: optionalText(3000), mission: optionalText(5000),
  schoolValues: z.json().nullable().optional(), operatingHours: z.json().nullable().optional(), socialLinks: z.json().nullable().optional(), googleMapsUrl: optionalUrl,
  contactInfo: z.json().nullable().optional(), footerContent: z.json().nullable().optional(), ppdbInfo: z.json().nullable().optional(), publicAnnouncements: z.json().nullable().optional(),
};

export const initializeSchoolSettingsSchema = z.object(schoolFields).strict();
export const updateSchoolSettingsSchema = initializeSchoolSettingsSchema
  .omit({ schoolCode: true })
  .partial()
  .extend({ expectedUpdatedAt: z.string().datetime({ offset: true }) })
  .strict()
  .refine((value) => Object.keys(value).some((key) => key !== "expectedUpdatedAt"), {
  message: "At least one editable field is required.",
});

export type InitializeSchoolSettingsInput = z.output<typeof initializeSchoolSettingsSchema>;
export type UpdateSchoolSettingsInput = z.output<typeof updateSchoolSettingsSchema>;
