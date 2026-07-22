import { resolveCanonicalSchool } from "@/modules/school/application/service";
import type { SchoolContextResolver } from "../application/context";

export class CanonicalSchoolContextResolver implements SchoolContextResolver {
  async resolveActiveSchoolId() {
    return (await resolveCanonicalSchool()).id;
  }
}
