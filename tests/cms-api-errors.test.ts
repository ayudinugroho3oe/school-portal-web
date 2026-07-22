import { describe, expect, it } from "vitest";
import { apiError } from "@/lib/api";
import { invalidConfiguration } from "@/modules/cms/domain/errors";

describe("CMS common API error handling", () => {
  it("uses the approved safe error envelope", async () => {
    const response = apiError(invalidConfiguration({ field: "typeCode" }), "request-cms");
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INVALID_CONFIGURATION",
        message: "The configuration is not supported.",
        details: { field: "typeCode" },
      },
      meta: { requestId: "request-cms" },
    });
  });
});
