import { describe, expect, it } from "vitest";
import {
  configurationBaseSchema,
  expectedUpdatedAtSchema,
  safeLinkSchema,
  structuredTextSchema,
} from "@/modules/cms/validation/schemas";

describe("CMS validation foundation", () => {
  it("normalizes safe configuration primitives", () => {
    expect(configurationBaseSchema.parse({ code: " hero-main ", label: "Hero", sortOrder: 4 })).toEqual({
      code: "HERO-MAIN",
      label: "Hero",
      sortOrder: 4,
      isVisible: true,
    });
  });

  it.each(["javascript:alert(1)", "data:text/html,test", "//untrusted.example/path", "relative/path"])(
    "rejects unsafe or ambiguous link %s",
    (value) => expect(() => safeLinkSchema.parse(value)).toThrow(),
  );

  it.each(["<script>alert(1)</script>", "<img onerror=alert(1)>", "javascript:alert(1)"])(
    "rejects executable structured text %s",
    (value) => expect(() => structuredTextSchema(500).parse(value)).toThrow(),
  );

  it("requires an offset-aware concurrency token", () => {
    expect(expectedUpdatedAtSchema.parse("2026-07-20T08:00:00+07:00")).toBeTruthy();
    expect(() => expectedUpdatedAtSchema.parse("2026-07-20T08:00:00")).toThrow();
  });
});
