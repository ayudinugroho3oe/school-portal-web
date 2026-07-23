import { cmsSingletonLifecycle } from "@/modules/school-content/presentation/route-handlers";
export const POST = (request: Request) => cmsSingletonLifecycle(request, "identity", "publish");
