import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import ClassPrograms from "../../components/ClassPrograms";

export const metadata: Metadata = {
  title: "PPDB 2026/2027",
  description: "Pilihan kelompok kelas dan pendaftaran PPDB TK Islam Ar Rahmah 48.",
};

export default function PPDBPage() {
  return <main className="bg-[#F8FAFC]">
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5,transparent_40%),radial-gradient(circle_at_top_right,#DBEAFE,transparent_35%),#FFFFFF] px-5 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-4xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-xs font-bold text-teal-700 shadow-sm"><ClipboardList size={16} aria-hidden="true" />PPDB Tahun Ajaran 2026/2027</span><h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Penerimaan Peserta Didik Baru</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">Pilih kelompok kelas yang sesuai, kemudian lengkapi formulir pendaftaran secara bertahap.</p><Link href="/ppdb/register" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-[18px] bg-gradient-to-r from-teal-700 to-emerald-500 px-6 font-bold text-white shadow-[0_12px_30px_rgba(16,185,129,0.22)]">Isi Formulir Pendaftaran<ArrowRight size={18} aria-hidden="true" /></Link></div>
    </section>
    <ClassPrograms title="Pilih Kelompok Kelas" subtitle="Pilih program yang paling sesuai dengan usia dan tahap perkembangan calon peserta didik." buttonLabel="Pilih Program" linkMode="register" className="bg-[#F8FAFC]" />
  </main>;
}
