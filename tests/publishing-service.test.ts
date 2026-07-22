import{describe,expect,it,vi}from"vitest";
import{PublishingApplicationService}from"@/modules/publishing/application/service";
const actor={id:crypto.randomUUID(),role:"SCHOOL_ADMIN"as const};const school=crypto.randomUUID();
function setup(){const repo={publish:vi.fn(),unpublish:vi.fn(),status:vi.fn(),listPublished:vi.fn(),readPublished:vi.fn()};const resolver={resolveActiveSchoolId:vi.fn().mockResolvedValue(school)};return{repo,resolver,service:new PublishingApplicationService(repo,resolver)};}
describe("publishing authorization boundary",()=>{
 it("authorizes before repository and School resolution",async()=>{const s=setup();await expect(s.service.publish({...actor,role:"STAFF"},"r","PROGRAM",crypto.randomUUID(),new Date().toISOString())).rejects.toMatchObject({code:"FORBIDDEN"});expect(s.resolver.resolveActiveSchoolId).not.toHaveBeenCalled();expect(s.repo.publish).not.toHaveBeenCalled();});
 it("passes canonical School and concurrency token",async()=>{const s=setup();const id=crypto.randomUUID(),token=new Date().toISOString();await s.service.publish(actor,"r","PROGRAM",id,token);expect(s.repo.publish).toHaveBeenCalledWith(expect.objectContaining({schoolId:school,entityId:id,expectedUpdatedAt:new Date(token)}));});
 it("uses archive permission for unpublish",async()=>{const s=setup();const id=crypto.randomUUID(),token=new Date().toISOString();await s.service.unpublish(actor,"r","TESTIMONIAL",id,token);expect(s.repo.unpublish).toHaveBeenCalledWith(expect.objectContaining({schoolId:school,entityId:id}));});
});
