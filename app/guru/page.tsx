import type { Metadata } from "next";
import { teachers } from "../../data/teachers";

export const metadata: Metadata = {
  title: "Guru dan Tenaga Pendidik",
  description: "Informasi guru dan tenaga pendidik TK Islam Ar Rahmah 48.",
};

export default function GuruPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#EEF6F1_0%,#FFF8EC_48%,#FCFBF7_78%,#EEF6F1_100%)] py-14 lg:py-16">
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
          <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-4">

          {teachers.map((teacher) => (

            <div
              key={teacher.id}
              className="rounded-3xl border border-white/80 bg-white p-6 text-center shadow-[0_14px_36px_rgba(15,81,50,0.09)] transition hover:-translate-y-2 hover:border-emerald-200 hover:shadow-[0_22px_46px_rgba(15,81,50,0.14)]"
            >

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#dff5e7,#fff1c9)] text-5xl shadow-inner">
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
          <p className="mt-8 rounded-3xl bg-white p-6 text-center text-gray-600 shadow-sm md:mt-10">
            Informasi tenaga pendidik belum tersedia.
          </p>
        )}
      </div>
    </main>
  );
}
