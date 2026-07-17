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
      <section className="bg-green-700 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">

          <p className="uppercase tracking-[0.3em] font-semibold">
            Program Unggulan
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Belajar Menjadi Menyenangkan
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-xl text-green-100">
            Program pembelajaran yang dirancang untuk
            mengembangkan karakter, kreativitas,
            dan kecerdasan anak secara seimbang.
          </p>

        </div>
      </section>


      {/* CONTENT */}
      <section className="py-24 bg-[#f8fcf9]">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {programs.map((program) => (

              <div
                key={program.title}
                className="bg-white rounded-3xl border border-green-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition"
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
      <section className="py-20 bg-white">

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
