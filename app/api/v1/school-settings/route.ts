import { apiError, ok, requestId } from "@/lib/api";
import { getCurrentActor } from "@/lib/auth/session";
import { unauthenticated } from "@/modules/school-settings/domain/errors";
import { readSchoolSettings, updateSchoolSettings } from "@/modules/school-settings/application/service";
import { updateSchoolSettingsSchema } from "@/modules/school-settings/validation/schemas";

export async function GET(request: Request) {
  const id = requestId(request);
  try { const actor = await getCurrentActor(); if (!actor) throw unauthenticated(); return ok(await readSchoolSettings(actor), id); }
  catch (error) { return apiError(error, id); }
}

export async function PATCH(request: Request) {
  const id = requestId(request);
  try {
    const actor = await getCurrentActor(); if (!actor) throw unauthenticated();
    const input = updateSchoolSettingsSchema.parse(await request.json());
    return ok(await updateSchoolSettings(actor, input, id), id);
  } catch (error) { return apiError(error, id); }
}
