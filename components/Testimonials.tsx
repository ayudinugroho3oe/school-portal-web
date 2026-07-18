import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-[linear-gradient(180deg,#ECFDF5_0%,#FFFFFF_100%)] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-4xl font-bold text-green-700">
            Apa Kata Orang Tua?
          </h2>

          <p className="mt-4 text-gray-600">
            Kepercayaan orang tua adalah motivasi kami untuk terus memberikan
            pendidikan terbaik.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_25px_45px_rgba(0,0,0,0.08)]"
            >
              <div className="text-yellow-500 text-xl mb-4">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-600 italic">
                &quot;{item.message}&quot;
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-green-700">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.relation}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
