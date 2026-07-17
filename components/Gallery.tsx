import Image from "next/image";

export default function Gallery() {
  const images = [
    {
      src: "/sekolah.jpg",
      title: "Lingkungan Sekolah",
    },
    {
      src: "/sekolah.jpg",
      title: "Kegiatan Belajar",
    },
    {
      src: "/sekolah.jpg",
      title: "Aktivitas Anak",
    },
  ];

  return (
    <section className="bg-gray-50 py-24">

      <div className="max-w-7xl mx-auto px-6">


        {/* HEADER */}
        <div className="text-center">

          <p className="
            text-green-700
            font-semibold
            uppercase
            tracking-[0.2em]
            text-sm
          ">
            Galeri
          </p>


          <h2 className="
            mt-4
            text-3xl
            md:text-4xl
            font-extrabold
            text-gray-900
          ">
            Aktivitas Peserta Didik
          </h2>


          <p className="
            mt-5
            text-gray-500
            max-w-2xl
            mx-auto
          ">
            Dokumentasi kegiatan pembelajaran,
            kreativitas, dan kebersamaan keluarga besar TK Islam Ar Rahmah 48.
          </p>

        </div>



        {/* GALLERY */}
        <div className="
          mt-14
          grid
          md:grid-cols-3
          gap-8
        ">


          {images.map((image) => (

            <div
              key={image.title}
              className="
                group
                overflow-hidden
                rounded-3xl
                shadow-lg
                bg-white
              "
            >

              <div className="overflow-hidden">

                <Image
                  src={image.src}
                  alt={image.title}
                  width={900}
                  height={700}
                  className="
                    h-72
                    w-full
                    object-cover
                    transition
                    duration-500
                    group-hover:scale-110
                  "
                />

              </div>


              <div className="p-5">

                <h3 className="
                  font-bold
                  text-lg
                  text-gray-800
                ">
                  {image.title}
                </h3>

              </div>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}
