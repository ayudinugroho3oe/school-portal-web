"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initializeSchoolSettingsSchema, updateSchoolSettingsSchema } from "@/modules/school-settings/validation/schemas";

type Props = { mode: "initialize" | "update"; initial?: Record<string, unknown>; readOnly?: boolean };
const groups = [
  ["Identitas", [["schoolCode","Kode Sekolah"],["schoolName","Nama Sekolah"],["isActive","Sekolah Aktif"],["shortName","Nama Singkat"],["npsn","NPSN"]]],
  ["Status", [["schoolLevel","Jenjang"],["ownershipStatus","Status Kepemilikan"],["foundationName","Nama Yayasan"],["principalName","Nama Kepala Sekolah"],["principalPhotoUrl","Foto Kepala Sekolah"],["principalWelcome","Sambutan Kepala Sekolah"]]],
  ["Kontak", [["email","Email"],["phone","Telepon"],["whatsapp","WhatsApp"],["websiteUrl","Website"]]],
  ["Alamat", [["addressLine","Alamat"],["village","Kelurahan/Desa"],["district","Kecamatan"],["city","Kota/Kabupaten"],["province","Provinsi"],["postalCode","Kode Pos"]]],
  ["Operasional", [["operationalPermitNumber","Nomor Izin Operasional"],["accreditation","Akreditasi"],["timezone","Zona Waktu"],["locale","Locale"],["academicYearLabel","Tahun Ajaran"]]],
  ["Brand & Narasi", [["logoUrl","Logo"],["logoDarkUrl","Logo Gelap"],["faviconUrl","Favicon"],["heroImageUrl","Foto Hero"],["buildingImageUrl","Foto Gedung"],["schoolMotto","Motto"],["history","Sejarah"],["vision","Visi"],["mission","Misi"],["googleMapsUrl","Google Maps"]]],
] as const;

export default function SchoolSettingsForm({ mode, initial = {}, readOnly = false }: Props) {
  const router = useRouter();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const schema = mode === "initialize" ? initializeSchoolSettingsSchema : updateSchoolSettingsSchema;
  const form = useForm<FieldValues>({ resolver: zodResolver(schema) as unknown as Resolver<FieldValues>, defaultValues: {
    schoolCode: "", schoolName: "", isActive: true, shortName: "", npsn: "", schoolLevel: "", ownershipStatus: "",
    foundationName: "", principalName: "", operationalPermitNumber: "", accreditation: "", email: "", phone: "", whatsapp: "",
    websiteUrl: "", addressLine: "", village: "", district: "", city: "", province: "", postalCode: "", timezone: "Asia/Jakarta",
    locale: "id-ID", academicYearLabel: "2026/2027", logoUrl: "", logoDarkUrl: "", schoolMotto: "", vision: "", mission: "", ...initial,
    ...(mode === "update" ? { expectedUpdatedAt: initial.updatedAt } : {}),
  } });
  const { isDirty, isSubmitting } = form.formState;
  useEffect(() => {
    const warning = (event: BeforeUnloadEvent) => { if (isDirty) event.preventDefault(); };
    addEventListener("beforeunload", warning); return () => removeEventListener("beforeunload", warning);
  }, [isDirty]);
  async function submit(values: FieldValues) {
    setNotice(null);
    const endpoint = mode === "initialize" ? "/api/v1/school-settings/initialize" : "/api/v1/school-settings";
    const response = await fetch(endpoint, { method: mode === "initialize" ? "POST" : "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json();
    if (!response.ok) { setNotice({ ok: false, text: body.error?.message ?? "Perubahan gagal disimpan." }); return; }
    form.reset({ ...values, ...(mode === "update" ? { expectedUpdatedAt: body.data.updatedAt } : {}) });
    setNotice({ ok: true, text: mode === "initialize" ? "Identitas sekolah berhasil dibuat." : "Perubahan berhasil disimpan." });
    if (mode === "initialize") { router.push("/admin/settings/school"); router.refresh(); }
  }
  return <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
    {groups.map(([title, fields]) => <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-lg font-bold">{title}</h2><div className="grid gap-5 md:grid-cols-2">
        {fields.map(([name,label]) => <div key={name} className={(name === "addressLine" || name === "vision" || name === "mission") ? "md:col-span-2" : ""}>
          <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
          {name === "isActive" ? <input id={name} type="checkbox" disabled={readOnly} {...form.register(name)} className="h-5 w-5 rounded border-slate-300 accent-teal-700" /> :
          name === "schoolLevel" || name === "ownershipStatus" ? <select id={name} disabled={readOnly} {...form.register(name)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100"><option value="">Belum diisi</option>{name === "schoolLevel" && <><option value="PAUD_TK">PAUD / TK</option><option value="TK">TK</option><option value="PAUD">PAUD</option></>}{name === "ownershipStatus" && <><option value="PRIVATE">Swasta</option><option value="PUBLIC">Negeri</option></>}</select> :
          name === "vision" || name === "mission" || name === "history" || name === "principalWelcome" ? <textarea id={name} disabled={readOnly} rows={4} {...form.register(name)} className="w-full rounded-xl border border-slate-300 p-3 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100" /> :
          <input id={name} disabled={readOnly || (mode === "update" && name === "schoolCode")} {...form.register(name)} className="h-11 w-full rounded-xl border border-slate-300 px-3 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100" />}
          {form.formState.errors[name] && <p className="mt-1 text-sm text-red-600">{String(form.formState.errors[name]?.message ?? "Nilai tidak valid.")}</p>}
        </div>)}
      </div>
    </section>)}
    {notice && <p role="status" className={`rounded-xl p-4 ${notice.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
    {!readOnly && <div className="sticky bottom-4 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur"><button disabled={isSubmitting || (mode === "update" && !isDirty)} className="h-12 rounded-xl bg-teal-700 px-6 font-bold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Menyimpan…" : mode === "initialize" ? "Buat Identitas Sekolah" : "Simpan Perubahan"}</button></div>}
  </form>;
}
