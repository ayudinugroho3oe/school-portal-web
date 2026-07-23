import { cmsSingletonRead, cmsSingletonUpdate } from "@/modules/school-content/presentation/route-handlers";
import { schoolProfileUpdateSchema } from "@/modules/school-content/validation/schemas";
export const GET = (request: Request) => cmsSingletonRead(request, "profile");
export const PUT = (request: Request) => cmsSingletonUpdate(request, "profile", schoolProfileUpdateSchema);
