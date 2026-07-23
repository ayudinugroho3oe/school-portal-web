import { redirect } from "next/navigation";
import SchoolContentEditor from "@/components/admin/SchoolContentEditor";
import { getCurrentActor } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { schoolContentService } from "@/modules/school-content/application/services";
export const dynamic = "force-dynamic";
export default async function IdentityPage() { const actor = await getCurrentActor(); if (!actor) redirect("/admin/login"); if (!can(actor.role,"cms.identity.view")) return <Denied/>; const data = await schoolContentService.read(actor,crypto.randomUUID(),"identity"); return <><Header/><SchoolContentEditor endpoint="/api/v1/cms/school-identity" initial={JSON.parse(JSON.stringify(data))} readOnly={!can(actor.role,"cms.identity.edit")} fields={[{name:"schoolName",label:"Nama sekolah",required:true,maxLength:160},{name:"shortName",label:"Nama singkat",maxLength:80},{name:"tagline",label:"Tagline",maxLength:150},{name:"logoMediaId",label:"Media ID logo"},{name:"logoDarkMediaId",label:"Media ID logo gelap"},{name:"faviconMediaId",label:"Media ID favicon"}]}/></>; }
const Header=()=> <header className="mb-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">CMS</p><h1 className="mt-2 text-3xl font-black">Identity</h1><p className="mt-2 text-slate-600">Kelola working copy identitas sekolah dan publikasinya.</p></header>;
const Denied=()=> <div role="alert">Akses ditolak.</div>;
