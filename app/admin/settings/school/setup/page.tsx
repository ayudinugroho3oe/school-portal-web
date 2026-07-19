import { redirect } from "next/navigation";
import SchoolSettingsForm from "@/components/admin/SchoolSettingsForm";
import { getCurrentActor } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { readSchoolSettings } from "@/modules/school-settings/application/service";
import { DomainError } from "@/modules/school-settings/domain/errors";

export const dynamic = "force-dynamic";
export default async function SetupSchoolPage() {
  const actor = await getCurrentActor(); if (!actor) redirect("/admin/login");
  if (!can(actor.role, "school_settings.initialize")) redirect("/admin/settings/school");
  try { await readSchoolSettings(actor); redirect("/admin/settings/school"); }
  catch (error) { if (!(error instanceof DomainError && error.code === "SCHOOL_SETTINGS_NOT_FOUND")) throw error; }
  return <><header className="mb-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">Provisioning awal</p><h1 className="mt-2 text-3xl font-black">Buat Identitas Sekolah</h1><p className="mt-2 max-w-2xl text-slate-600">Membuat satu record PRIMARY_SCHOOL. Operasi ini hanya tersedia untuk Super Admin dan tidak dapat diulang.</p></header><SchoolSettingsForm mode="initialize" /></>;
}
