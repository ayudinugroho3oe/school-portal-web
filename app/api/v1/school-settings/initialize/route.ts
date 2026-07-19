import { apiError, ok, requestId } from "@/lib/api";
import { getCurrentActor } from "@/lib/auth/session";
import { unauthenticated } from "@/modules/school-settings/domain/errors";
import { initializeSchoolSettings } from "@/modules/school-settings/application/service";
import { initializeSchoolSettingsSchema } from "@/modules/school-settings/validation/schemas";

export async function POST(request: Request) {
  const id = requestId(request);
  try {
    const actor = await getCurrentActor(); if (!actor) throw unauthenticated();
    const input = initializeSchoolSettingsSchema.parse(await request.json());
    return ok(await initializeSchoolSettings(actor, input, id), id, 201);
  } catch (error) { return apiError(error, id); }
}
