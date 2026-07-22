import { describe,expect,it } from "vitest";
import { galleryAlbumCreateSchema,galleryItemCreateSchema,programCreateSchema,teacherCreateSchema,testimonialCreateSchema } from "@/modules/structured-content/validation/schemas";

describe("structured content validation",()=>{
 it("accepts valid domain payloads",()=>{
  expect(programCreateSchema.parse({code:"TAHFIDZ",title:"Tahfidz",slug:"tahfidz",summary:"Ringkas",description:"Terstruktur",sortOrder:0,isActive:true})).toBeTruthy();
  expect(teacherCreateSchema.parse({name:"Ibu Guru",sortOrder:0,isActive:true})).toBeTruthy();
  expect(galleryAlbumCreateSchema.parse({title:"MPLS",slug:"mpls",sortOrder:0,isActive:true})).toBeTruthy();
  expect(galleryItemCreateSchema.parse({mediaId:crypto.randomUUID(),sortOrder:0,isActive:true})).toBeTruthy();
  expect(testimonialCreateSchema.parse({authorName:"Orang Tua",quote:"Sekolah yang hangat.",sortOrder:0,isActive:true})).toBeTruthy();
 });
 it.each([
  ()=>programCreateSchema.parse({code:"bad code",title:"X",slug:"Bad Slug",summary:"x",description:"x",sortOrder:-1,isActive:true}),
  ()=>teacherCreateSchema.parse({name:"",biography:"<script>alert(1)</script>",sortOrder:0,isActive:true}),
  ()=>galleryAlbumCreateSchema.parse({title:"X",slug:"../x",sortOrder:0,isActive:true}),
  ()=>galleryItemCreateSchema.parse({mediaId:"bad",sortOrder:0,isActive:true}),
  ()=>testimonialCreateSchema.parse({authorName:"X",quote:"javascript:alert(1)",sortOrder:0,isActive:true}),
 ])("rejects unsafe or invalid payload",fn=>expect(fn).toThrow());
});
