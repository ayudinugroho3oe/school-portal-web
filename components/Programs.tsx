export default function Programs() {
  const programs = [
    {
      title: "Tahfidz Qur'an",
      icon: "📖",
      desc: "Mengenalkan dan membiasakan anak mencintai Al-Qur'an sejak dini.",
    },
    {
      title: "English Class",
      icon: "🌍",
      desc: "Pembelajaran bahasa Inggris melalui aktivitas menyenangkan.",
    },
    {
      title: "Cooking Class",
      icon: "👨‍🍳",
      desc: "Melatih kreativitas, kemandirian, dan keterampilan anak.",
    },
    {
      title: "Science & Experiment",
      icon: "🔬",
      desc: "Mengembangkan rasa ingin tahu melalui kegiatan eksperimen.",
    },
    {
      title: "Manasik Haji",
      icon: "🕋",
      desc: "Mengenalkan nilai ibadah dan praktik keagamaan sejak dini.",
    },
    {
      title: "Outing Class",
      icon: "🚌",
      desc: "Belajar langsung melalui pengalaman di luar sekolah.",
    },
  ];


  return (
    <section className="bg-green-50 py-24">

      <div className="max-w-7xl mx-auto px-6">


        <div className="text-center">

          <p className="
            text-green-700
            font-semibold
            uppercase
            tracking-[0.2em]
            text-sm
          ">
            Program Unggulan
          </p>


          <h2 className="
            mt-4
            text-3xl
            md:text-4xl
            font-extrabold
            text-gray-900
          ">
            Belajar Menjadi Menyenangkan
          </h2>


          <p className="
            mt-5
            text-gray-500
            max-w-2xl
            mx-auto
            leading-relaxed
          ">
            Kurikulum dirancang untuk mengembangkan iman,
            karakter, kreativitas, dan kecerdasan anak secara seimbang.
          </p>


        </div>



        <div className="
          mt-16
          grid
          gap-8
          md:grid-cols-2
          lg:grid-cols-3
        ">


          {programs.map((program) => (

            <div
              key={program.title}
              className="
                bg-white
                rounded-3xl
                p-8
                shadow-sm
                border
                border-green-100
                text-center
                transition
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >


              <div className="
                mx-auto
                w-20
                h-20
                rounded-3xl
                bg-green-100
                flex
                items-center
                justify-center
                text-5xl
              ">
                {program.icon}
              </div>



              <h3 className="
                mt-6
                text-2xl
                font-bold
                text-green-800
              ">
                {program.title}
              </h3>



              <p className="
                mt-4
                text-gray-500
                leading-7
              ">
                {program.desc}
              </p>


            </div>

          ))}


        </div>


      </div>


    </section>
  );
}