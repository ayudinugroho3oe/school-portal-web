import { describe, expect, it } from "vitest";
import { initializeSchoolSettings, readSchoolSettings, updateSchoolSettings } from "@/modules/school-settings/application/service";

describe("School Settings service authorization boundary", () => {
  it("denies TEACHER before database access", async () => await expect(readSchoolSettings({ id: crypto.randomUUID(), role: "TEACHER" })).rejects.toMatchObject({ code: "FORBIDDEN" }));
  it("denies SCHOOL_ADMIN initialization before database access", async () => await expect(initializeSchoolSettings({ id: crypto.randomUUID(), role: "SCHOOL_ADMIN" }, {} as never, "request")).rejects.toMatchObject({ code: "FORBIDDEN" }));
  it("denies STAFF update before database access", async () => await expect(updateSchoolSettings({ id: crypto.randomUUID(), role: "STAFF" }, {} as never, "request")).rejects.toMatchObject({ code: "FORBIDDEN" }));
});
