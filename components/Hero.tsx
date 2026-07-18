import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, Sparkles, Star, Users } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5_0%,transparent_40%),radial-gradient(circle_at_top_right,#DBEAFE_0%,transparent_35%),#FFFFFF]">
      <div className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-emerald-100/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-50 blur-3xl" />
      <div className="pointer-events-none absolute right-[18%] top-20 h-24 w-24 rounded-full bg-rose-100/45 blur-2xl" />
      <div className="pointer-events-none absolute left-[44%] top-20 hidden h-24 w-24 rounded-full border border-dashed border-green-300/50 lg:block" />
      <div className="pointer-events-none absolute bottom-16 left-[47%] hidden h-3 w-3 rounded-full bg-amber-400 lg:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,#F8FAFC)]" />

      <div className="hero-grid relative mx-auto max-w-[1320px] px-5 pb-8 pt-5 font-sans sm:px-6 lg:px-7 lg:pb-7 lg:pt-7">
        <div className="hero-title self-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#EEF6F1,#FFF8EC)] px-4 py-2 text-xs font-semibold text-green-700 ring-1 ring-green-100 sm:text-sm">
            <Star size={15} className="fill-amber-400 text-amber-500" aria-hidden="true" />
            Sekolah Islam • Kurikulum Merdeka
          </div>

          <h1 className="mt-4 text-[2.2rem] font-extrabold leading-[1.03] tracking-[-0.045em] text-slate-900 sm:text-5xl md:text-[2.35rem] lg:text-[2.7rem] xl:text-[2.8rem]">
            <span className="block">Membangun</span>
            <span className="block text-green-700">Generasi Qurani</span>
            <span className="block">yang Ceria,</span>
            <span className="block">Mandiri &amp;</span>
            <span className="block">Berkarakter</span>
          </h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />
        </div>

        <div className="hero-visual relative mb-8 mt-7 md:mb-0 lg:mt-0">
          <div className="absolute -inset-5 -z-10 rotate-[-3deg] rounded-[34%_66%_31%_69%/42%_31%_69%_58%] bg-[linear-gradient(135deg,rgba(167,243,208,0.72),rgba(219,234,254,0.66))] blur-[1px] sm:-inset-7" />
          <div className="absolute -bottom-8 -right-5 -z-10 h-36 w-52 rotate-6 rounded-[50%] bg-amber-200/45 blur-xl sm:h-48 sm:w-64" />
          <div className="absolute -left-4 top-[18%] -z-10 h-24 w-24 rounded-full border border-dashed border-teal-400/30 sm:-left-8 sm:h-32 sm:w-32" />
          <HeroCarousel />

          <Sparkles className="absolute -right-2 -top-6 hidden text-amber-400 lg:block" size={36} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <div className="hero-description hidden md:block">
          <p className="max-w-[430px] text-base leading-7 text-slate-600 md:text-sm md:leading-6 lg:text-sm lg:leading-6">
            TK Islam Ar Rahmah 48 menghadirkan pendidikan usia dini berbasis nilai-nilai Islam, pembelajaran aktif, serta lingkungan yang aman, nyaman, dan menyenangkan.
          </p>
        </div>

        <div className="hero-ctas grid gap-3 lg:flex lg:flex-row">
          <Link
            href="/ppdb/register"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#0F766E,#10B981)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.25)] transition duration-300 ease-out hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 sm:text-base"
          >
            <GraduationCap size={18} aria-hidden="true" />
            Daftar PPDB 2026/2027
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="/program"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-[#0F766E] bg-white px-6 py-3 text-sm font-semibold text-[#0F766E] transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#ECFDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 sm:text-base"
          >
            <BookOpen size={18} aria-hidden="true" />
            Jelajahi Program
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="hero-features grid grid-cols-4 gap-0 text-[9px] text-slate-600 sm:max-w-3xl sm:text-[10px] lg:text-xs">
          <div className="group flex flex-col items-center gap-1 px-2 text-center transition duration-200 hover:-translate-y-1 lg:flex-row lg:gap-2.5 lg:px-3 lg:text-left">
            <span className="rounded-xl bg-[#EEF6F1] p-2 text-green-700 transition group-hover:rotate-[-5deg]"><GraduationCap size={19} aria-hidden="true" /></span>
            <span className="font-medium leading-5">Guru Berpengalaman</span>
          </div>
          <div className="group flex flex-col items-center gap-1 border-l border-slate-200 px-2 text-center transition duration-200 hover:-translate-y-1 lg:flex-row lg:gap-2.5 lg:px-3 lg:text-left">
            <span className="rounded-xl bg-[#FFF8EC] p-2 text-amber-700 transition group-hover:rotate-[-5deg]"><BookOpen size={19} aria-hidden="true" /></span>
            <span className="font-medium leading-5">Pembelajaran Islami</span>
          </div>
          <div className="group flex flex-col items-center gap-1 border-l border-slate-200 px-2 text-center transition duration-200 hover:-translate-y-1 lg:flex-row lg:gap-2.5 lg:px-3 lg:text-left">
            <span className="rounded-xl bg-[#FFF1ED] p-2 text-rose-600 transition group-hover:rotate-[-5deg]"><Users size={19} aria-hidden="true" /></span>
            <span className="font-medium leading-5">Lingkungan Ramah Anak</span>
          </div>
          <div className="group flex flex-col items-center gap-1 border-l border-slate-200 px-2 text-center transition duration-200 hover:-translate-y-1 lg:flex-row lg:gap-2.5 lg:px-3 lg:text-left">
            <span className="rounded-xl bg-[#F3F2F8] p-2 text-indigo-600 transition group-hover:rotate-[-5deg]"><HeartHandshake size={19} aria-hidden="true" /></span>
            <span className="font-medium leading-5">Mendidik dengan Cinta &amp; Teladan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
