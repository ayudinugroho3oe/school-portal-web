import { describe, expect, it } from "vitest";
import { can } from "@/lib/auth/permissions";

describe("School Settings permissions", () => {
  it("allows only SUPER_ADMIN to initialize", () => { expect(can("SUPER_ADMIN", "school_settings.initialize")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.initialize")).toBe(false); });
  it("allows SUPER_ADMIN, SCHOOL_ADMIN and STAFF to read", () => { expect(can("SUPER_ADMIN", "school_settings.read")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.read")).toBe(true); expect(can("STAFF", "school_settings.read")).toBe(true); expect(can("TEACHER", "school_settings.read")).toBe(false); });
  it("allows administrators to update", () => { expect(can("SUPER_ADMIN", "school_settings.update")).toBe(true); expect(can("SCHOOL_ADMIN", "school_settings.update")).toBe(true); expect(can("STAFF", "school_settings.update")).toBe(false); });
});
