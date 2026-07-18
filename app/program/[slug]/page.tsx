import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Brain, HeartHandshake, Palette, PersonStanding, Sparkles, UsersRound } from "lucide-react";
import { classProgramAlbumsByProgram, classPrograms } from "../../../data/school-programs";
import { getProgram, programs } from "../../../data/programs";
import FeaturedProgramDetail from "../../../components/FeaturedProgramDetail";
import ClassAlbumSlider from "../../../components/ClassAlbumSlider";

const developmentAreas = [
  { title: "Nilai Agama dan Moral", icon: HeartHandshake, color: "bg-teal-50 text-teal-700" },
  { title: "Fisik dan Motorik", icon: PersonStanding, color: "bg-emerald-50 text-emerald-700" },
  { title: "Bahasa", icon: BookOpen, color: "bg-blue-50 text-blue-700" },
  { title: "Kognitif", icon: Brain, color: "bg-amber-50 text-amber-700" },
  { title: "Sosial Emosional", icon: UsersRound, color: "bg-rose-50 text-rose-700" },
  { title: "Seni dan Kreativitas", icon: Palette, color: "bg-violet-50 text-violet-700" },
];

export const dynamicParams = false;
export function generateStaticParams() { return [...classPrograms.map((program) => ({ slug: program.id })), ...programs.map((program) => ({ slug: program.slug }))]; }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = classPrograms.find((item) => item.id === slug);
  const featuredProgram = getProgram(slug);
  if (program) return { title: `Program ${program.name}`, description: program.description };
  if (featuredProgram) return { title: featuredProgram.title, description: featuredProgram.description };
  return {};
}

export default async function ClassProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const featuredProgram = getProgram(slug);
  if (featuredProgram) return <FeaturedProgramDetail program={featuredProgram} />;
  const program = classPrograms.find((item) => item.id === slug);
  if (!program) notFound();

  return <main className="bg-[#F8FAFC]">
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5,transparent_40%),radial-gradient(circle_at_top_right,#DBEAFE,transparent_35%),#FFFFFF] px-5 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div><nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500"><Link href="/" className="hover:text-teal-700">Beranda</Link><span>/</span><Link href="/program" className="hover:text-teal-700">Program</Link><span>/</span><span className="font-semibold text-slate-700">{program.name}</span></nav><p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Kelompok Kelas</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Program {program.name}</h1><p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{program.description}</p></div>
        <div className="relative overflow-hidden rounded-[32px_20px_32px_20px] border-[6px] border-white shadow-[0_28px_70px_rgba(15,118,110,0.16)]"><Image src={program.image} alt={`Kegiatan belajar program ${program.name}`} width={900} height={620} preload sizes="(min-width: 1024px) 55vw, 100vw" className="h-[300px] w-full object-cover sm:h-[420px]" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-white/5" /></div>
      </div>
    </section>

    <section className="bg-white px-5 py-20 sm:px-6 lg:py-28"><div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-2 lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Tentang Program</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Belajar, Bertumbuh, dan Berkarakter</h2><p className="mt-5 leading-8 text-slate-600">{program.description}</p></div><div className="grid gap-4"><div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5"><h3 className="font-bold text-slate-900">Tujuan Pembelajaran</h3><p className="mt-2 text-sm leading-7 text-slate-500">Mendukung perkembangan anak melalui pengalaman belajar yang sesuai dengan fokus kelompok kelas {program.name}.</p></div><div className="rounded-[22px] border border-slate-200 bg-teal-50/50 p-5"><h3 className="font-bold text-slate-900">Belajar Sambil Bermain</h3><p className="mt-2 text-sm leading-7 text-slate-500">Kegiatan disajikan secara aktif, menyenangkan, dan mendorong anak untuk mengeksplorasi lingkungan belajar.</p></div></div></div></section>

    <section className="px-5 py-20 sm:px-6 lg:py-28"><div className="mx-auto max-w-[1200px]"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Fokus Perkembangan</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Perkembangan Anak yang Seimbang</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{developmentAreas.map(({ title, icon: Icon, color }, index) => <article key={title} className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}><Icon size={21} aria-hidden="true" /></span><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{program.focusAreas[index]}</p></article>)}</div></div></section>

    <section className="bg-white px-5 py-20 sm:px-6 lg:py-28"><div className="mx-auto max-w-[1120px]"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Kegiatan Utama</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">Pengalaman Belajar yang Aktif</h2><p className="mt-4 leading-7 text-slate-500">Kegiatan dirancang untuk mendukung fokus perkembangan kelompok kelas {program.name}.</p></div><div className="grid gap-3 sm:grid-cols-2">{program.activities.map((activity) => <div key={activity} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><Sparkles size={18} className="shrink-0 text-amber-500" aria-hidden="true" /><span className="text-sm font-semibold text-slate-700">{activity}</span></div>)}</div></div>
      <ClassAlbumSlider albums={classProgramAlbumsByProgram[program.id]} />
    </div></section>

    <section className="px-5 py-20 sm:px-6 lg:py-28"><div className="mx-auto max-w-4xl rounded-[32px] bg-[linear-gradient(135deg,#0F766E,#10B981)] px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(15,118,110,0.20)] sm:px-10"><h2 className="text-3xl font-extrabold">Tertarik Bergabung di Program {program.name}?</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50">Lengkapi formulir PPDB atau pelajari informasi pendaftaran sebelum memilih kelompok kelas.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href={`/ppdb/register?program=${program.id}`} className="inline-flex min-h-12 items-center justify-center rounded-[18px] bg-white px-6 font-bold text-teal-800">Daftar Program {program.name}</Link><Link href="/ppdb" className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-white/50 px-6 font-bold text-white hover:bg-white/10">Lihat Informasi PPDB</Link></div></div></section>
  </main>;
}
