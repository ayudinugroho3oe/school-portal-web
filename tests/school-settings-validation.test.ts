import { describe, expect, it } from "vitest";
import { initializeSchoolSettingsSchema, updateSchoolSettingsSchema } from "@/modules/school-settings/validation/schemas";

const valid = { schoolCode: " ar48 ", schoolName: "Sekolah", schoolLevel: "PAUD_TK", ownershipStatus: "PRIVATE", principalName: "Kepala", whatsapp: "081234567890", addressLine: "Alamat", city: "Jakarta", province: "DKI Jakarta", timezone: "Asia/Jakarta", locale: "id-ID", academicYearLabel: "2026/2027" };
describe("School Settings validation", () => {
  it("accepts minimal technical identity without operational content", () => { const value = initializeSchoolSettingsSchema.parse({ schoolCode: "AR48", schoolName: "Sekolah" }); expect(value).toMatchObject({ schoolCode: "AR48", schoolName: "Sekolah", isActive: true, timezone: "Asia/Jakarta", locale: "id-ID" }); });
  it("normalizes school code and WhatsApp", () => { const value = initializeSchoolSettingsSchema.parse(valid); expect(value.schoolCode).toBe("AR48"); expect(value.whatsapp).toBe("6281234567890"); });
  it("rejects unknown fields", () => expect(() => initializeSchoolSettingsSchema.parse({ ...valid, unknown: true })).toThrow());
  it("rejects invalid timezone", () => expect(() => initializeSchoolSettingsSchema.parse({ ...valid, timezone: "Mars/Olympus" })).toThrow());
  it("requires concurrency token on update", () => expect(() => updateSchoolSettingsSchema.parse({ schoolName: "Baru" })).toThrow());
  it("rejects immutable schoolCode on update", () => expect(() => updateSchoolSettingsSchema.parse({ schoolCode: "NEW", expectedUpdatedAt: new Date().toISOString() })).toThrow());
});
