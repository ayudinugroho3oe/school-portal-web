import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[600px]">


        {/* BAGIAN TEKS */}
        <div
          className="
            relative
            z-20
            flex
            items-center
            bg-[#f1f8f3]
            px-6
            lg:px-16
            py-16
          "
        >

          <div className="max-w-xl">

            <h1
              className="
                text-4xl
                lg:text-5xl
                font-extrabold
                leading-tight
              "
            >

              <span className="text-green-700">
                Membangun Generasi Qurani
              </span>

              <br />

              <span className="text-slate-900">
                yang Ceria, Mandiri
                <br />
                dan Berkarakter
              </span>

            </h1>


            <p
              className="
                mt-6
                text-lg
                text-slate-600
                max-w-lg
              "
            >
              Kami hadir untuk memberikan pendidikan terbaik
              berlandaskan nilai-nilai Islam dan kasih sayang.
            </p>


            <div className="flex flex-wrap gap-5 mt-8">

              <button
                className="
                  bg-green-700
                  text-white
                  px-8
                  py-3
                  rounded-full
                  font-semibold
                  hover:bg-green-800
                "
              >
                📖 Tentang Kami
              </button>


              <button
                className="
                  border
                  border-green-700
                  text-green-700
                  px-8
                  py-3
                  rounded-full
                  font-semibold
                "
              >
                ▶ Video Profil
              </button>

            </div>

          </div>

        </div>



        {/* FOTO */}
        <div
          className="
            relative
            h-[350px]
            lg:h-[600px]
          "
        >

          <Image
            src="/sekolah.jpg"
            alt="TK Islam Ar Rahmah"
            fill
            priority
            className="
              object-cover
              object-center
            "
          />


          {/* CURVE DESKTOP */}
          <div
            className="
              hidden
              lg:block
              absolute
              left-[-80px]
              top-0
              h-full
              w-[170px]
              bg-[#f1f8f3]
              z-10
            "
            style={{
              clipPath: "ellipse(70% 50% at 0% 50%)",
            }}
          />

        </div>


      </div>

    </section>
  );
}