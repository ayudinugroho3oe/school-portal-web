import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Programs from "../components/Programs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>

        <Hero />

        <section className="bg-white py-20">

          <div className="max-w-7xl mx-auto px-6">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

              <div className="bg-green-700 rounded-3xl text-white p-8 text-center">

                <h2 className="text-5xl font-bold">
                  15+
                </h2>

                <p className="mt-3">
                  Tahun Berdiri
                </p>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

                <h2 className="text-5xl font-bold text-green-700">
                  250+
                </h2>

                <p className="mt-3 text-gray-600">
                  Peserta Didik
                </p>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

                <h2 className="text-5xl font-bold text-green-700">
                  20+
                </h2>

                <p className="mt-3 text-gray-600">
                  Guru & Staff
                </p>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

                <h2 className="text-5xl font-bold text-green-700">
                  100%
                </h2>

                <p className="mt-3 text-gray-600">
                  Pembelajaran Islami
                </p>

              </div>

            </div>

          </div>

        </section>

        <Features />

        <Programs />
                <section className="bg-gray-50 py-24">

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center">

              <p className="text-green-700 font-semibold uppercase tracking-widest">
                Galeri
              </p>

              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                Aktivitas Peserta Didik
              </h2>

            </div>

            <div className="mt-14 grid md:grid-cols-3 gap-6">

              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900"
                  alt=""
                  className="h-72 w-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=900"
                  alt=""
                  className="h-72 w-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=900"
                  alt=""
                  className="h-72 w-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

            </div>

          </div>

        </section>

        <section className="py-24 bg-green-700">

          <div className="max-w-5xl mx-auto px-6 text-center text-white">

            <h2 className="text-5xl font-bold">
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

        <Footer />

      </main>

    </>
  );
}