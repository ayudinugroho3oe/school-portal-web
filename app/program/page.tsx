import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Program Unggulan",
  description: "Program pembelajaran unggulan TK Islam Ar Rahmah 48 untuk mengembangkan karakter, kreativitas, dan kecerdasan anak.",
};

export default function ProgramPage() {
  const programs = [
    {
      title: "Tahfidz Qur'an",
      icon: "📖",
      desc: "Membiasakan anak mencintai Al-Qur'an melalui hafalan surat pendek, doa harian, dan adab Islami.",
    },
    {
      title: "English Class",
      icon: "🌍",
      desc: "Belajar bahasa Inggris dengan metode bermain, bernyanyi, dan bercerita.",
    },
    {
      title: "Cooking Class",
      icon: "👨‍🍳",
      desc: "Mengembangkan kreativitas, motorik halus, dan kemandirian anak.",
    },
    {
      title: "Science & Experiment",
      icon: "🔬",
      desc: "Belajar sains sederhana melalui eksperimen yang menyenangkan.",
    },
    {
      title: "Manasik Haji",
      icon: "🕋",
      desc: "Mengenalkan rukun Islam melalui praktik manasik haji sejak dini.",
    },
    {
      title: "Outing Class",
      icon: "🚌",
      desc: "Belajar langsung di luar sekolah melalui pengalaman nyata.",
    },
  ];

  return (
    <main>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FCFBF7_0%,#FFF8EC_52%,#EEF6F1_100%)] py-16 md:py-20">
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-[8%] h-72 w-72 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-[18%] top-12 h-16 w-16 rotate-12 rounded-[22px] border border-indigo-200/70 bg-white/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.9))]" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">

          <p className="inline-flex rounded-full border border-emerald-100 bg-white/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-green-700 shadow-sm backdrop-blur">
            Program Unggulan
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Belajar Menjadi Menyenangkan
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            Program pembelajaran yang dirancang untuk
            mengembangkan karakter, kreativitas,
            dan kecerdasan anak secara seimbang.
          </p>

        </div>
      </section>


      {/* CONTENT */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#EEF6F1_42%,#FFF8EC_100%)] py-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {programs.map((program) => (

              <div
                key={program.title}
                className="rounded-3xl border border-emerald-100/80 bg-white p-8 shadow-[0_12px_30px_rgba(15,81,50,0.07)] transition hover:-translate-y-2 hover:border-amber-200 hover:shadow-[0_20px_44px_rgba(15,81,50,0.13)]"
              >

                <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center text-5xl">
                  {program.icon}
                </div>

                <h2 className="mt-6 text-2xl font-bold text-green-800">
                  {program.title}
                </h2>

                <p className="mt-4 text-gray-600 leading-7">
                  {program.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-[linear-gradient(180deg,#FFF8EC_0%,#FCFBF7_52%,#EEF6F1_100%)] py-20">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Siap Bergabung Bersama Kami?
          </h2>

          <p className="mt-5 text-gray-600">
            Mari berikan pengalaman belajar terbaik
            untuk putra-putri Anda di TK Islam Ar Rahmah 48.
          </p>

          <Link
            href="/kontak"
            className="mt-8 inline-flex bg-green-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
          >
            Daftar PPDB
          </Link>

        </div>

      </section>

    </main>
  );
}
