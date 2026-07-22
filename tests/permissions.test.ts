import { describe, expect, it } from "vitest";
import { can } from "@/lib/auth/permissions";

describe("School Settings permissions", () => {
  it("allows only SUPER_ADMIN to initialize", () => { expect(can("SUPER_ADMIN", "school_settings.initialize")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.initialize")).toBe(false); });
  it("allows SUPER_ADMIN, SCHOOL_ADMIN and STAFF to read", () => { expect(can("SUPER_ADMIN", "school_settings.read")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.read")).toBe(true); expect(can("STAFF", "school_settings.read")).toBe(true); expect(can("TEACHER", "school_settings.read")).toBe(false); });
  it("allows administrators to update", () => { expect(can("SUPER_ADMIN", "school_settings.update")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.update")).toBe(true); expect(can("STAFF", "school_settings.update")).toBe(false); });
});

describe("Sprint 5.2.3 configuration permissions", () => {
  const configurationPermissions = [
    "cms.configuration.read",
    "cms.contact_channel.manage",
    "cms.social_link.manage",
    "cms.cta.manage",
  ] as const;

  it.each(configurationPermissions)("grants %s explicitly to SUPER_ADMIN and SCHOOL_ADMIN", (permission) => {
    expect(can("SUPER_ADMIN", permission)).toBe(true);
    expect(can("SCHOOL_ADMIN", permission)).toBe(true);
  });

  it.each(configurationPermissions)("denies %s to STAFF and TEACHER", (permission) => {
    expect(can("STAFF", permission)).toBe(false);
    expect(can("TEACHER", permission)).toBe(false);
  });
});

describe("Sprint 5.2.4 media permissions", () => {
  const schoolAdminMedia = ["cms.media.view", "cms.media.create", "cms.media.edit", "cms.media.archive", "cms.media.manage_media"] as const;
  it.each(schoolAdminMedia)("grants %s to both administrators only", (permission) => {
    expect(can("SUPER_ADMIN", permission)).toBe(true); expect(can("SCHOOL_ADMIN", permission)).toBe(true);
    expect(can("STAFF", permission)).toBe(false); expect(can("TEACHER", permission)).toBe(false);
  });
  it("reserves physical deletion for Super Admin", () => {
    expect(can("SUPER_ADMIN", "cms.media.delete")).toBe(true);
    expect(can("SCHOOL_ADMIN", "cms.media.delete")).toBe(false);
  });
});

describe("Sprint 5.2.5 structured content permissions",()=>{
 const admin=["cms.program.view","cms.program.create","cms.program.edit","cms.program.archive","cms.program.reorder","cms.teacher.view","cms.teacher.create","cms.teacher.edit","cms.teacher.archive","cms.teacher.reorder","cms.gallery.view","cms.gallery.create","cms.gallery.edit","cms.gallery.archive","cms.gallery.reorder","cms.testimonial.view","cms.testimonial.create","cms.testimonial.edit","cms.testimonial.archive","cms.testimonial.reorder"] as const;
 it.each(admin)("grants %s explicitly to administrators",permission=>{expect(can("SUPER_ADMIN",permission)).toBe(true);expect(can("SCHOOL_ADMIN",permission)).toBe(true);expect(can("STAFF",permission)).toBe(false);expect(can("TEACHER",permission)).toBe(false);});
 it.each(["cms.program.delete","cms.teacher.delete","cms.gallery.delete","cms.testimonial.delete"] as const)("reserves %s for Super Admin",permission=>{expect(can("SUPER_ADMIN",permission)).toBe(true);expect(can("SCHOOL_ADMIN",permission)).toBe(false);});
});
