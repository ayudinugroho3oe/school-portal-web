import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-[45%_55%]
      ">


        {/* TEXT */}
        <div
          className="
            relative
            z-20
            flex
            items-center
            bg-gradient-to-br
            from-[#eef8f1]
            to-white
            px-6
            md:px-10
            lg:px-16
            py-14
            lg:py-20
          "
        >

          <div className="max-w-xl">


            <h1
              className="
                text-3xl
                md:text-4xl
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
                text-base
                md:text-lg
                text-slate-600
                leading-relaxed
                max-w-lg
              "
            >
              Kami hadir untuk memberikan pendidikan terbaik
              berlandaskan nilai-nilai Islam dan kasih sayang.
            </p>



            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-4
                mt-8
              "
            >

              <button
                className="
                  bg-green-700
                  text-white
                  px-8
                  py-3
                  rounded-full
                  font-semibold
                  shadow-lg
                  transition
                  hover:scale-105
                  hover:bg-green-800
                "
              >
                📖 Tentang Kami
              </button>



              <button
                className="
                  border-2
                  border-green-700
                  text-green-700
                  px-8
                  py-3
                  rounded-full
                  font-semibold
                  transition
                  hover:bg-green-700
                  hover:text-white
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
            h-[320px]
            md:h-[450px]
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



          {/* OVERLAY FOTO */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-green-900/10
              to-transparent
            "
          />



          {/* CURVE */}
          <div
            className="
              hidden
              lg:block
              absolute
              left-[-120px]
              top-0
              h-full
              w-[220px]
              bg-[#eef8f1]
              z-10
            "
            style={{
              clipPath: "ellipse(65% 50% at 0% 50%)",
            }}
          />


        </div>


      </div>


    </section>
  );
}