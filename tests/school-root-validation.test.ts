import { describe, expect, it } from "vitest";
import { provisionSchoolRootSchema } from "@/modules/school/validation/schemas";

describe("canonical School root validation", () => {
  it("normalizes a generic school code and applies installation defaults", () => {
    expect(provisionSchoolRootSchema.parse({ schoolCode: " school_01 ", schoolName: " Example School " })).toEqual({
      schoolCode: "SCHOOL_01",
      schoolName: "Example School",
      isActive: true,
      timezone: "Asia/Jakarta",
      locale: "id-ID",
    });
  });

  it("rejects inactive provisioning and invalid technical identity", () => {
    expect(() => provisionSchoolRootSchema.parse({ schoolCode: "bad code", schoolName: "Example", isActive: false })).toThrow();
  });
});
