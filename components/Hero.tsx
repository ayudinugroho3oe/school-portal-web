import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Blur */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-green-100 blur-3xl opacity-70" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-14 lg:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200">
              <Star size={16} className="fill-green-600 text-green-600" />
              Sekolah Islam • Kurikulum Merdeka
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Membangun
              <span className="block text-green-700">
                Generasi Qurani
              </span>
              yang Ceria,
              <span className="block">
                Mandiri & Berkarakter
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              TK Islam Ar Rahmah 48 menghadirkan pendidikan usia dini
              berbasis nilai-nilai Islam, pembelajaran aktif,
              serta lingkungan yang aman, nyaman, dan menyenangkan.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/program"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-7 py-4 font-semibold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
              >
                Lihat Program
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/kontak"
                className="inline-flex items-center justify-center rounded-full border border-green-700 px-7 py-4 font-semibold text-green-700 transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
              >
                Hubungi Kami
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-green-700" size={18} />
                Guru Berpengalaman
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="text-green-700" size={18} />
                Pembelajaran Islami
              </div>

              <div className="flex items-center gap-2">
                <Users className="text-green-700" size={18} />
                Lingkungan Ramah Anak
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[36px] shadow-2xl">
              <Image
                src="/sekolah.jpg"
                alt="TK Islam Ar Rahmah 48"
                width={900}
                height={700}
                priority
                className="h-[520px] w-full object-cover"
              />
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -left-8 top-10 hidden rounded-3xl bg-white p-5 shadow-xl lg:block">
              <div className="text-3xl font-bold text-green-700">15+</div>
              <div className="text-sm text-slate-500">
                Tahun Pengalaman
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -right-6 bottom-16 hidden rounded-3xl bg-white p-5 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-green-100 p-3">
                  <GraduationCap
                    size={24}
                    className="text-green-700"
                  />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    PPDB Dibuka
                  </p>

                  <p className="text-sm text-slate-500">
                    Tahun Ajaran Baru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTIC */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-bold text-green-700">
              15+
            </div>

            <div className="mt-2 font-semibold text-slate-800">
              Tahun Berdiri
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Konsisten memberikan pendidikan Islam yang berkualitas.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-bold text-green-700">
              200+
            </div>

            <div className="mt-2 font-semibold text-slate-800">
              Alumni
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Tumbuh menjadi anak yang mandiri dan berakhlak mulia.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl font-bold text-green-700">
              100%
            </div>

            <div className="mt-2 font-semibold text-slate-800">
              Pembelajaran Islami
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Mengintegrasikan nilai-nilai Al-Qur&apos;an dalam kegiatan belajar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
