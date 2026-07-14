export default function Programs() {
  const programs = [
    {
      title: "Tahfidz Qur'an",
      icon: "📖",
    },
    {
      title: "English Class",
      icon: "🌍",
    },
    {
      title: "Cooking Class",
      icon: "👨‍🍳",
    },
    {
      title: "Science & Experiment",
      icon: "🔬",
    },
    {
      title: "Manasik Haji",
      icon: "🕋",
    },
    {
      title: "Outing Class",
      icon: "🚌",
    },
  ];

  return (
    <section className="bg-green-50 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <p className="text-green-700 font-semibold uppercase tracking-widest">
            Program Unggulan
          </p>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Belajar Menjadi Menyenangkan
          </h2>

          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Kurikulum dirancang untuk mengembangkan iman,
            karakter,
            kreativitas,
            dan kecerdasan anak secara seimbang.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {programs.map((program) => (

            <div
              key={program.title}
              className="bg-white rounded-3xl shadow hover:shadow-2xl transition hover:-translate-y-2 p-10 text-center"
            >

              <div className="text-6xl">
                {program.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-green-800">
                {program.title}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}