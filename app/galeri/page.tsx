import Image from "next/image";
import type { Metadata } from "next";
import { galleries } from "../../data/gallery";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Galeri kegiatan belajar, bermain, dan pembiasaan Islami di TK Islam Ar Rahmah 48.",
};

export default function GaleriPage() {
  return (
    <main className="bg-green-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <p className="text-green-700 font-semibold uppercase tracking-[0.2em]">
            Galeri
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-green-900">
            Dokumentasi Kegiatan
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            Berbagai kegiatan belajar, bermain, dan pembiasaan Islami
            di TK Islam Ar Rahmah 48.
          </p>

        </div>

        {galleries.length > 0 ? (
          <div className="grid gap-8 mt-14 md:grid-cols-2 lg:grid-cols-3">

          {galleries.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition duration-300"
            >

              <div className="relative h-64 bg-green-100">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h2 className="text-xl font-bold text-green-800">
                  {item.title}
                </h2>

              </div>

            </div>

          ))}

          </div>
        ) : (
          <p className="mt-14 rounded-3xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Dokumentasi kegiatan belum tersedia.
          </p>
        )}

      </div>
    </main>
  );
}
