import { describe, expect, it } from "vitest";
import {
  callToActionCreateSchema,
  contactChannelCreateSchema,
  reorderSchema,
  socialLinkCreateSchema,
} from "@/modules/configuration/validation/schemas";

describe("Contact Channel validation", () => {
  it("normalizes a valid WhatsApp channel", () => {
    expect(contactChannelCreateSchema.parse({ typeCode: "whatsapp", label: "WhatsApp", value: "0812-3456-7890" })).toMatchObject({
      typeCode: "WHATSAPP",
      value: "6281234567890",
      isActive: true,
      sortOrder: 0,
    });
  });

  it.each([
    { typeCode: "UNKNOWN", label: "Unknown", value: "value" },
    { typeCode: "EMAIL", label: "Email", value: "not-an-email" },
    { typeCode: "PHONE", label: "Phone", value: "123" },
    { typeCode: "WHATSAPP", label: "WhatsApp", value: "123" },
    { typeCode: "GOOGLE_MAPS", label: "Map", value: "School", url: "javascript:alert(1)" },
  ])("rejects malformed contact input", (input) => expect(() => contactChannelCreateSchema.parse(input)).toThrow());
});

describe("Social Link validation", () => {
  it("accepts an approved platform with a safe URL", () => {
    expect(socialLinkCreateSchema.parse({ platformCode: "instagram", label: "Instagram", url: "https://instagram.com/example" })).toMatchObject({ platformCode: "INSTAGRAM" });
  });

  it.each([
    { platformCode: "UNKNOWN", label: "Unknown", url: "https://example.com" },
    { platformCode: "TIKTOK", label: "TikTok", url: "data:text/html,test" },
    { platformCode: "YOUTUBE", label: "YouTube", url: "file:///tmp/test" },
  ])("rejects unknown platforms and unsafe URLs", (input) => expect(() => socialLinkCreateSchema.parse(input)).toThrow());
});

describe("CTA and ordering validation", () => {
  it("accepts a configurable safe CTA code", () => {
    expect(callToActionCreateSchema.parse({ code: "admission-2027", label: "Register", targetUrl: "/ppdb" })).toMatchObject({ code: "ADMISSION-2027" });
  });

  it("rejects malformed CTA codes, unsafe targets, and schoolId mass assignment", () => {
    expect(() => callToActionCreateSchema.parse({ code: "bad code", label: "Bad", targetUrl: "/" })).toThrow();
    expect(() => callToActionCreateSchema.parse({ code: "SAFE", label: "Bad", targetUrl: "javascript:alert(1)" })).toThrow();
    expect(() => callToActionCreateSchema.parse({ code: "SAFE", label: "Bad", targetUrl: "/", schoolId: crypto.randomUUID() })).toThrow();
  });

  it("requires unique IDs and bounded ordering input", () => {
    const id = crypto.randomUUID();
    expect(() => reorderSchema.parse({ ids: [id, id], expectedCollectionUpdatedAt: new Date().toISOString() })).toThrow();
  });
});
