import Image from "next/image";

export default function ProfilPage() {
  return (
    <main>

      {/* HERO */}
      <section className="bg-green-700 py-20">

        <div className="max-w-7xl mx-auto px-6 text-center text-white">

          <p className="uppercase tracking-[0.3em] font-semibold">
            Profil Sekolah
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            TK Islam Ar Rahmah 48
          </h1>

          <p className="mt-6 text-xl text-green-100 max-w-3xl mx-auto">
            Membentuk generasi Qurani yang ceria, mandiri,
            berkarakter, dan siap menghadapi masa depan.
          </p>

        </div>

      </section>



      {/* SEJARAH */}
      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <p className="text-green-700 font-semibold uppercase tracking-[0.2em]">
              Sejarah
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
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
              alt="Sekolah"
              fill
              className="object-cover"
            />

          </div>

        </div>

      </section>



      {/* VISI MISI */}

      <section className="bg-[#f8fcf9] py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

          <div className="bg-white rounded-3xl p-10 shadow">

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



          <div className="bg-white rounded-3xl p-10 shadow">

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

      <section className="py-24 bg-white">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <div className="w-40 h-40 rounded-full bg-green-100 mx-auto"></div>

          <h2 className="mt-8 text-4xl font-bold">
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