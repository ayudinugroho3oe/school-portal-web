import { describe, expect, it } from "vitest";
import { schoolIdentityUpdateSchema, schoolProfileUpdateSchema } from "@/modules/school-content/validation/schemas";
const token = new Date().toISOString();
describe("School content validation", () => {
  it("rejects empty identity names, oversized taglines, and mass assignment", () => {
    expect(() => schoolIdentityUpdateSchema.parse({ schoolName: "", expectedUpdatedAt: token })).toThrow();
    expect(() => schoolIdentityUpdateSchema.parse({ schoolName: "School", tagline: "x".repeat(151), expectedUpdatedAt: token })).toThrow();
    expect(() => schoolIdentityUpdateSchema.parse({ schoolName: "School", schoolId: crypto.randomUUID(), expectedUpdatedAt: token })).toThrow();
  });
  it("requires vision and mission and caps summary", () => {
    expect(() => schoolProfileUpdateSchema.parse({ vision: "Vision", mission: "Mission", summary: "x".repeat(501), expectedUpdatedAt: token })).toThrow();
    expect(() => schoolProfileUpdateSchema.parse({ vision: "Vision", mission: "Mission", expectedUpdatedAt: token })).not.toThrow();
  });
});
