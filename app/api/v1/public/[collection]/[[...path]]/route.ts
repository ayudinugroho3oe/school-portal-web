import{publicList,publicRead}from"@/modules/publishing/presentation/route-handlers";
import type{PublishableType}from"@/modules/publishing/domain/contracts";
const types={programs:"PROGRAM",teachers:"TEACHER_PROFILE",galleries:"GALLERY_ALBUM",testimonials:"TESTIMONIAL"}as const;
export async function GET(req:Request,ctx:RouteContext<"/api/v1/public/[collection]/[[...path]]">){const p=await ctx.params;const type=types[p.collection as keyof typeof types]as PublishableType|undefined;if(!type)return new Response(null,{status:404});const path=p.path??[];if(!path.length)return publicList(req,type);if(path.length===1)return publicRead(req,path[0],type);return new Response(null,{status:404});}
