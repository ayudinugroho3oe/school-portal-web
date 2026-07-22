import { socialLinkService } from "@/modules/configuration/application/services";
import { updateConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { socialLinkUpdateSchema } from "@/modules/configuration/validation/schemas";

export async function PATCH(request: Request, context: RouteContext<"/api/v1/cms/social-links/[id]">) {
  return updateConfiguration(request, (await context.params).id, socialLinkService, socialLinkUpdateSchema);
}
