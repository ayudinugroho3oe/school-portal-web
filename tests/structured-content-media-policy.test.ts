import {describe,expect,it,vi} from "vitest";
import {requireUsableMedia} from "@/modules/structured-content/application/media-policy";
import type {MediaAssetRepository} from "@/modules/media/domain/repository";

const school="11111111-1111-4111-8111-111111111111";
function repo(result:unknown){return {findById:vi.fn().mockResolvedValue(result)} as unknown as MediaAssetRepository;}
describe("structured content media policy",()=>{
 it.each(["ACTIVE","READY"])("accepts same-School %s media",async status=>await expect(requireUsableMedia(repo({schoolId:school,status}),school,"id")).resolves.toBeUndefined());
 it.each([null,{schoolId:school,status:"ARCHIVED"},{schoolId:school,status:"FAILED"}])("rejects missing or unusable media",async value=>await expect(requireUsableMedia(repo(value),school,"id")).rejects.toBeTruthy());
 it("rejects cross-School media because lookup is scoped",async()=>{const r=repo(null);await expect(requireUsableMedia(r,school,"id")).rejects.toBeTruthy();expect(r.findById).toHaveBeenCalledWith(school,"id");});
});
