import { describe, expect, it, vi } from "vitest";
import { createCmsRequestContext } from "@/modules/cms/application/context";

describe("CMS shared application context", () => {
  it("authorizes before resolving the installation School", async () => {
    const resolver = { resolveActiveSchoolId: vi.fn(async () => crypto.randomUUID()) };
    await expect(createCmsRequestContext(
      { id: crypto.randomUUID(), role: "TEACHER" },
      "school_settings.read",
      "request-denied",
      resolver,
    )).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(resolver.resolveActiveSchoolId).not.toHaveBeenCalled();
  });

  it("returns immutable server-derived school scope", async () => {
    const schoolId = crypto.randomUUID();
    const actor = { id: crypto.randomUUID(), role: "STAFF" as const };
    const context = await createCmsRequestContext(actor, "school_settings.read", "request-allowed", {
      resolveActiveSchoolId: async () => schoolId,
    });
    expect(context).toEqual({ actor, schoolId, requestId: "request-allowed" });
    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context.actor)).toBe(true);
  });
});
