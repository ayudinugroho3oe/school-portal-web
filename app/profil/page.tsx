import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Sekolah",
  description: "Profil, sejarah, visi, dan misi TK Islam Ar Rahmah 48.",
};

export default function ProfilPage() {
  return (
    <main>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#FCFBF7_0%,#FFF8EC_52%,#EEF6F1_100%)] py-16 md:py-20">
        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-[8%] h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[18%] top-12 h-16 w-16 rotate-12 rounded-full border border-amber-300/60 bg-white/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.9))]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">

          <p className="inline-flex rounded-full border border-emerald-100 bg-white/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-green-700 shadow-sm backdrop-blur">
            Profil Sekolah
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            TK Islam Ar Rahmah 48
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            Membentuk generasi Qurani yang ceria, mandiri,
            berkarakter, dan siap menghadapi masa depan.
          </p>

        </div>

      </section>



      {/* SEJARAH */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#FFF8EC_48%,#EEF6F1_100%)] py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <p className="text-green-700 font-semibold uppercase tracking-[0.2em]">
              Sejarah
            </p>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Tentang TK Islam Ar Rahmah 48
            </h2>

            <p className="mt-8 text-gray-600 leading-8">
              TK Islam Ar Rahmah 48 hadir sebagai lembaga pendidikan
              anak usia dini yang berkomitmen memberikan pendidikan
              berkualitas dengan landasan nilai-nilai Islam.

              Kami percaya setiap anak adalah amanah yang harus
              dibimbing dengan kasih sayang agar tumbuh menjadi
              generasi yang beriman, cerdas, kreatif, dan mandiri.
            </p>

          </div>


          <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl">

            <Image
              src="/sekolah.jpg"
              alt="Lingkungan TK Islam Ar Rahmah 48"
              fill
              className="object-cover"
            />

          </div>

        </div>

      </section>



      {/* VISI MISI */}

      <section className="bg-[linear-gradient(180deg,#EEF6F1,#FFF8EC)] py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

          <div className="rounded-3xl border border-emerald-100/70 bg-white p-6 shadow-[0_16px_40px_rgba(15,81,50,0.08)] sm:p-10">

            <h3 className="text-3xl font-bold text-green-700">
              Visi
            </h3>

            <p className="mt-6 text-gray-600 leading-8">
              Menjadi lembaga pendidikan Islam yang unggul
              dalam membentuk generasi Qurani,
              berakhlak mulia,
              kreatif,
              dan mandiri.
            </p>

          </div>



          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,81,50,0.08)] sm:p-10">

            <h3 className="text-3xl font-bold text-green-700">
              Misi
            </h3>

            <ul className="mt-6 space-y-4 text-gray-600">

              <li>✓ Menanamkan nilai Islam sejak dini.</li>

              <li>✓ Mengembangkan kreativitas anak.</li>

              <li>✓ Membentuk karakter mandiri.</li>

              <li>✓ Menjalin kerja sama dengan orang tua.</li>

            </ul>

          </div>

        </div>

      </section>



      {/* KEPALA SEKOLAH */}

      <section className="bg-[linear-gradient(180deg,#FFF8EC_0%,#ffffff_24%,#EEF6F1_100%)] py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <div className="w-40 h-40 rounded-full bg-green-100 mx-auto"></div>

          <h2 className="mt-8 text-3xl font-bold md:text-4xl">
            Sambutan Kepala Sekolah
          </h2>

          <p className="mt-8 text-gray-600 leading-8">

            Selamat datang di TK Islam Ar Rahmah 48.

            Kami percaya bahwa pendidikan anak usia dini
            merupakan pondasi utama dalam membangun karakter,
            akhlak, dan kecerdasan anak.

            Bersama guru dan orang tua,
            kami berkomitmen menghadirkan pendidikan yang
            menyenangkan dan berkualitas.

          </p>

        </div>

      </section>

    </main>
  );
}
