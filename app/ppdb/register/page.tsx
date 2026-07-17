import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Home } from "lucide-react";
import PPDBRegisterForm from "../../../components/ppdb/register/PPDBRegisterForm";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran PPDB",
  description: "Prototype formulir pendaftaran peserta didik baru TK Islam Ar Rahmah 48.",
};

export default async function PPDBRegisterPage({ searchParams }: { searchParams: Promise<{ program?: string | string[] }> }) {
  const query = await searchParams;
  const initialProgram = typeof query.program === "string" ? query.program : undefined;
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5,transparent_38%),radial-gradient(circle_at_top_right,#DBEAFE,transparent_32%),#F8FAFC] px-4 py-10 sm:px-6 lg:py-16">
      <div className="pointer-events-none absolute left-[8%] top-36 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1080px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Home size={15} aria-hidden="true" />
          <Link href="/" className="rounded hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Beranda</Link>
          <span aria-hidden="true">/</span><span>PPDB</span><span aria-hidden="true">/</span>
          <span className="font-medium text-slate-700">Formulir Pendaftaran</span>
        </nav>

        <header className="mb-8 mt-7">
          <span className="inline-flex rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-xs font-bold text-teal-700 shadow-sm backdrop-blur">
            PPDB Tahun Ajaran 2026/2027
          </span>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Formulir Pendaftaran Peserta Didik Baru
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Lengkapi data calon siswa secara bertahap. Pastikan informasi yang dimasukkan benar dan sesuai dokumen resmi.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500"><Clock3 size={17} aria-hidden="true" />Estimasi waktu pengisian: 5–10 menit</p>
        </header>

        <PPDBRegisterForm initialProgramId={initialProgram} />
      </div>
    </main>
  );
}
