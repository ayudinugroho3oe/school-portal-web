import { Pencil } from "lucide-react";
import { getClassProgram } from "../../../data/school-programs";
import type { FileState, FormDataState, UpdateField } from "./types";

function Summary({ title, step, onEdit, items }: { title: string; step: number; onEdit: (step: number) => void; items: [string, string][] }) {
  return <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between gap-4"><h3 className="font-bold text-slate-900">{title}</h3><button type="button" onClick={() => onEdit(step)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><Pencil size={14} aria-hidden="true" />Ubah</button></div><dl className="mt-4 grid gap-3 sm:grid-cols-2">{items.map(([label,value]) => <div key={label}><dt className="text-xs font-medium text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-700">{value || "Belum diisi"}</dd></div>)}</dl></section>;
}

export default function ReviewStep({ data, files, update, onEdit, onEditProgram }: { data: FormDataState; files: FileState; update: UpdateField; onEdit: (step: number) => void; onEditProgram: () => void }) {
  const fileList = Object.values(files).filter(Boolean).join(", ");
  const programName = getClassProgram(data.program)?.name ?? "Belum dipilih";
  return <div><div className="mb-7"><h2 className="text-2xl font-bold text-slate-900">Review Data</h2><p className="mt-2 text-sm leading-6 text-slate-500">Periksa kembali data sebelum mensimulasikan pengiriman.</p></div><div className="grid gap-5">
    <Summary title="Program yang Dipilih" step={0} onEdit={() => onEditProgram()} items={[["Program",programName]]} />
    <Summary title="Data Calon Siswa" step={1} onEdit={onEdit} items={[["Nama Lengkap",data.studentName],["Nama Panggilan",data.nickname],["NIK",data.studentNik],["Jenis Kelamin",data.gender],["Tempat, Tanggal Lahir",[data.birthPlace,data.birthDate].filter(Boolean).join(", ")],["Status Keluarga",data.familyStatus]]} />
    <Summary title="Alamat" step={1} onEdit={onEdit} items={[["Alamat Lengkap",data.address],["Kelurahan / Kecamatan",[data.village,data.district].filter(Boolean).join(" / ")],["Kota / Provinsi",[data.city,data.province].filter(Boolean).join(" / ")],["Kode Pos",data.postalCode]]} />
    <Summary title="Data Ayah" step={2} onEdit={onEdit} items={[["Nama",data.fatherName],["Pekerjaan",data.fatherJob],["Pendidikan",data.fatherEducation],["WhatsApp",data.fatherWhatsapp]]} />
    <Summary title="Data Ibu" step={2} onEdit={onEdit} items={[["Nama",data.motherName],["Pekerjaan",data.motherJob],["Pendidikan",data.motherEducation],["WhatsApp",data.motherWhatsapp]]} />
    <Summary title="Kontak Utama" step={2} onEdit={onEdit} items={[["Email",data.parentEmail],["WhatsApp",data.mainWhatsapp],["Hubungan",data.relationship],["Nama Wali",data.guardianName]]} />
    <Summary title="Dokumen" step={3} onEdit={onEdit} items={[["Riwayat Sekolah",data.previousSchool],["Dokumen Dipilih",fileList || "Belum ada dokumen"]]} />
  </div><label className="mt-7 flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600"><input type="checkbox" checked={data.agreement === "true"} onChange={(event) => update("agreement", String(event.target.checked))} className="mt-1 accent-teal-700" /><span>Saya menyatakan bahwa seluruh data yang saya isi benar dan dapat dipertanggungjawabkan.</span></label><p className="mt-4 text-sm text-amber-700">Pada versi prototype ini, data belum dikirim atau disimpan ke sistem.</p></div>;
}
