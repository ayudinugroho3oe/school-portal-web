import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-green-700">
            Apa Kata Orang Tua?
          </h2>

          <p className="mt-4 text-gray-600">
            Kepercayaan orang tua adalah motivasi kami untuk terus memberikan
            pendidikan terbaik.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition"
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
