import Hero from "../components/Hero";
import Features from "../components/Features";
import Programs from "../components/Programs";
import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <main>

      <Hero />

      {/* STATISTIK */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            <div className="bg-green-700 rounded-3xl text-white p-8 text-center">
              <h2 className="text-5xl font-bold">15+</h2>
              <p className="mt-3">Tahun Berdiri</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <h2 className="text-5xl font-bold text-green-700">250+</h2>
              <p className="mt-3 text-gray-600">Peserta Didik</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <h2 className="text-5xl font-bold text-green-700">20+</h2>
              <p className="mt-3 text-gray-600">Guru & Staff</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <h2 className="text-5xl font-bold text-green-700">100%</h2>
              <p className="mt-3 text-gray-600">Pembelajaran Islami</p>
            </div>

          </div>

        </div>
      </section>

      <Features />

      <Programs />

      <Gallery />

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

          <button className="mt-10 bg-white text-green-700 px-10 py-4 rounded-full font-bold hover:scale-105 transition">
            Daftar Sekarang
          </button>

        </div>
      </section>

    </main>
  );
}