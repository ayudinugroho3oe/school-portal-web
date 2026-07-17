import type { Metadata } from "next";
import { teachers } from "../../data/teachers";

export const metadata: Metadata = {
  title: "Guru dan Tenaga Pendidik",
  description: "Informasi guru dan tenaga pendidik TK Islam Ar Rahmah 48.",
};

export default function GuruPage() {
  return (
    <main className="bg-green-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">

          <p className="text-green-700 font-semibold uppercase tracking-[0.2em]">
            Tenaga Pendidik
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-green-900">
            Guru TK Islam Ar Rahmah 48
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            Guru-guru kami berkomitmen mendidik anak dengan kasih sayang,
            keteladanan, dan nilai-nilai Islami.
          </p>

        </div>

        {teachers.length > 0 ? (
          <div className="grid gap-8 mt-14 md:grid-cols-2 lg:grid-cols-4">

          {teachers.map((teacher) => (

            <div
              key={teacher.id}
              className="bg-white rounded-3xl shadow-lg p-6 text-center hover:-translate-y-2 transition"
            >

              <div className="w-28 h-28 rounded-full bg-green-100 mx-auto flex items-center justify-center text-5xl">
                👩‍🏫
              </div>

              <h2 className="mt-6 text-xl font-bold text-green-800">
                {teacher.name}
              </h2>

              <p className="mt-2 font-semibold text-yellow-600">
                {teacher.position}
              </p>

              <p className="mt-3 text-gray-500 text-sm">
                {teacher.education}
              </p>

            </div>

          ))}

          </div>
        ) : (
          <p className="mt-14 rounded-3xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Informasi tenaga pendidik belum tersedia.
          </p>
        )}
      </div>
    </main>
  );
}
