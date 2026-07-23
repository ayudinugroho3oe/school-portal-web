import { describe, expect, it, vi } from "vitest";
import { SchoolContentService } from "@/modules/school-content/application/service";
const schoolId=crypto.randomUUID(); const actor={id:crypto.randomUUID(),role:"SCHOOL_ADMIN" as const};
function setup(){const repository={read:vi.fn(),updateIdentity:vi.fn(),updateProfile:vi.fn()};const resolver={resolveActiveSchoolId:vi.fn().mockResolvedValue(schoolId)};return{repository,resolver,service:new SchoolContentService(repository,resolver)};}
describe("School content authorization boundary",()=>{
  it("rejects unauthorized actors before resolving School or accessing repository",async()=>{const x=setup();await expect(x.service.read({...actor,role:"STAFF"},"r","identity")).rejects.toMatchObject({code:"FORBIDDEN"});expect(x.resolver.resolveActiveSchoolId).not.toHaveBeenCalled();expect(x.repository.read).not.toHaveBeenCalled();});
  it("passes canonical School and audit context to update",async()=>{const x=setup();const input={schoolName:"School",expectedUpdatedAt:new Date().toISOString()};await x.service.updateIdentity(actor,"request",input);expect(x.repository.updateIdentity).toHaveBeenCalledWith(schoolId,actor.id,"request",input);});
});
