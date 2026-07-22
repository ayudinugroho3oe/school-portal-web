import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ConfigurationRegistry } from "@/modules/cms/configuration/registry";

describe("CMS configuration registry", () => {
  it("parses only values backed by a registered schema", () => {
    const registry = new ConfigurationRegistry().register({ code: "hero", schema: z.object({ headline: z.string().min(1) }) });
    expect(registry.codes()).toEqual(["HERO"]);
    expect(registry.parse<{ headline: string }>("hero", { headline: "Welcome" })).toEqual({ headline: "Welcome" });
    expect(() => registry.parse("unknown", {})).toThrowError(expect.objectContaining({ code: "INVALID_CONFIGURATION" }));
  });

  it("rejects duplicate or unsafe registry codes", () => {
    const registry = new ConfigurationRegistry([{ code: "HERO", schema: z.object({}) }]);
    expect(() => registry.register({ code: "hero", schema: z.object({}) })).toThrowError(expect.objectContaining({ code: "INVALID_CONFIGURATION" }));
    expect(() => registry.register({ code: "../unsafe", schema: z.object({}) })).toThrowError(expect.objectContaining({ code: "INVALID_CONFIGURATION" }));
  });
});
