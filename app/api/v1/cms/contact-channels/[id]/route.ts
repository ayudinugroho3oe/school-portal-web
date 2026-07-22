import { contactChannelService } from "@/modules/configuration/application/services";
import { updateConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { contactChannelUpdateSchema } from "@/modules/configuration/validation/schemas";

export async function PATCH(request: Request, context: RouteContext<"/api/v1/cms/contact-channels/[id]">) {
  return updateConfiguration(request, (await context.params).id, contactChannelService, contactChannelUpdateSchema);
}
