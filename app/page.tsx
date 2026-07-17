import Hero from "../components/Hero";
import Features from "../components/Features";
import Programs from "../components/Programs";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* STATISTIK */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">

            <div className="bg-green-700 rounded-3xl text-white p-4 text-center sm:p-8">
              <p className="text-3xl font-bold sm:text-5xl">15+</p>
              <p className="mt-3">Tahun Berdiri</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-4 text-center sm:p-8">
              <p className="text-3xl font-bold text-green-700 sm:text-5xl">250+</p>
              <p className="mt-3 text-gray-600">Peserta Didik</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-4 text-center sm:p-8">
              <p className="text-3xl font-bold text-green-700 sm:text-5xl">20+</p>
              <p className="mt-3 text-gray-600">Guru & Staff</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-4 text-center sm:p-8">
              <p className="text-3xl font-bold text-green-700 sm:text-5xl">100%</p>
              <p className="mt-3 text-gray-600">Pembelajaran Islami</p>
            </div>

          </div>
        </div>
      </section>

      <Features />

      <Programs />

      <Gallery />

      <Testimonials />

      {/* PPDB */}
      <section className="py-24 bg-green-700">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">

          <h2 className="text-4xl md:text-5xl font-bold">
            Penerimaan Peserta Didik Baru
          </h2>

          <p className="mt-6 text-xl">
            Mari bergabung bersama keluarga besar
            TK Islam Ar Rahmah 48.
          </p>

          <Link
            href="/kontak"
            className="mt-10 inline-flex bg-white text-green-700 px-10 py-4 rounded-full font-bold hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-green-700"
          >
            Daftar Sekarang
          </Link>

        </div>
      </section>
    </main>
  );
}
