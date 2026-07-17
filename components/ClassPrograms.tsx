import Link from "next/link";
import { ArrowRight, Baby, BookOpenCheck, GraduationCap } from "lucide-react";
import { classPrograms } from "../data/school-programs";

const icons = [Baby, BookOpenCheck, GraduationCap];
const accents = [
  "bg-teal-50 text-teal-700 border-teal-100",
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-100",
];

export default function ClassPrograms({
  title = "Pilihan Kelompok Kelas",
  subtitle = "Pilih kelompok kelas yang sesuai dengan usia dan tahap perkembangan putra-putri Anda.",
  buttonLabel = "Daftar PPDB",
  linkMode = "detail",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  linkMode?: "detail" | "register";
  className?: string;
}) {
  return <section className={`bg-white py-20 lg:py-28 ${className}`}>
    <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Kelompok Kelas</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-slate-500">{subtitle}</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{classPrograms.map((program, index) => { const Icon = icons[index]; const href = linkMode === "register" ? `/ppdb/register?program=${program.id}` : `/program/${program.id}`; const label = linkMode === "detail" ? `Lihat Program ${program.name}` : buttonLabel; return <article key={program.id} className="group flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_24px_46px_rgba(15,118,110,0.10)] sm:p-7"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accents[index]}`}><Icon size={23} aria-hidden="true" /></span><h3 className="mt-5 text-2xl font-extrabold text-slate-900">{program.name}</h3><p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{program.description}</p><Link href={href} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-teal-700 bg-white px-5 text-sm font-bold text-teal-700 transition hover:-translate-y-0.5 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">{label}<ArrowRight size={17} aria-hidden="true" /></Link></article>; })}</div>
    </div>
  </section>;
}
