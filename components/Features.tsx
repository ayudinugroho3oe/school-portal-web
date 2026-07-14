export default function Features() {
  const items = [
    {
      icon: "🕌",
      title: "Pendidikan Islami",
      desc: "Membiasakan akhlak mulia, ibadah, dan cinta Al-Qur'an sejak dini.",
    },
    {
      icon: "🎨",
      title: "Belajar Kreatif",
      desc: "Metode belajar aktif melalui bermain, bereksplorasi, dan berkarya.",
    },
    {
      icon: "👩‍🏫",
      title: "Guru Profesional",
      desc: "Tenaga pendidik yang berpengalaman, sabar, dan penuh kasih sayang.",
    },
    {
      icon: "🤝",
      title: "Kolaborasi Orang Tua",
      desc: "Sekolah dan keluarga tumbuh bersama demi masa depan anak.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <p className="text-green-700 font-semibold uppercase tracking-widest">
            Mengapa Memilih Kami
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Pendidikan Terbaik Dimulai Sejak Dini
          </h2>

          <p className="mt-5 text-gray-500 max-w-3xl mx-auto">
            Kami menghadirkan lingkungan belajar yang Islami,
            menyenangkan, aman, dan mendukung perkembangan karakter anak.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="text-5xl">
                {item.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-500 leading-7">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}