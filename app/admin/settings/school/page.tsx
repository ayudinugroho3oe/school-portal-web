import { redirect } from "next/navigation";
import SchoolSettingsForm from "@/components/admin/SchoolSettingsForm";
import { getCurrentActor } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { readSchoolSettings } from "@/modules/school-settings/application/service";
import { DomainError } from "@/modules/school-settings/domain/errors";

export const dynamic = "force-dynamic";
export default async function SchoolSettingsPage() {
  const actor = await getCurrentActor(); if (!actor) redirect("/admin/login");
  if (!can(actor.role, "school_settings.read")) return <AccessDenied />;
  let settings;
  try { settings = await readSchoolSettings(actor); }
  catch (error) {
    if (error instanceof DomainError && error.code === "SCHOOL_SETTINGS_NOT_FOUND" && can(actor.role, "school_settings.initialize")) redirect("/admin/settings/school/setup");
    if (error instanceof DomainError && error.code === "SCHOOL_SETTINGS_NOT_FOUND") return <div className="rounded-2xl border bg-white p-6"><h1 className="text-2xl font-bold">Identitas belum tersedia</h1><p className="mt-2 text-slate-600">Hubungi Super Admin untuk melakukan provisioning awal.</p></div>;
    throw error;
  }
  const initial = JSON.parse(JSON.stringify(settings)) as Record<string, unknown>;
  return <><header className="mb-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">Pengaturan</p><h1 className="mt-2 text-3xl font-black">Identitas Sekolah</h1><p className="mt-2 text-slate-600">{can(actor.role, "school_settings.update") ? "Perbarui data dengan perlindungan optimistic concurrency." : "Mode baca sesuai izin peran Anda."}</p></header><SchoolSettingsForm mode="update" initial={initial} readOnly={!can(actor.role, "school_settings.update")} /></>;
}
function AccessDenied() { return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6"><h1 className="text-2xl font-bold text-red-900">Akses ditolak</h1><p className="mt-2 text-red-700">Peran Anda tidak memiliki izin membaca identitas sekolah.</p></div>; }
