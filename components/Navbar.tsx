import Image from "next/image";

export default function Navbar() {
  return (
    <>
      {/* HEADER */}
      <header
        className="
          bg-white
          px-4
          md:px-8
          py-3
          md:py-4
          flex
          items-center
          justify-between
          border-b
          border-gray-100
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              relative
              w-[70px]
              h-[70px]
              md:w-[90px]
              md:h-[90px]
              flex-shrink-0
            "
          >
            <Image
              src="/logo.png"
              alt="Logo TK Islam Ar Rahmah 48"
              fill
              priority
              className="object-contain"
            />
          </div>


          <div>
            <h1
              className="
                text-xl
                md:text-3xl
                font-extrabold
                text-green-800
                leading-tight
              "
            >
              TK Islam Ar Rahmah 48
            </h1>

            <p
              className="
                text-sm
                md:text-xl
                text-gray-500
              "
            >
              Mendidik Generasi Qurani
            </p>

          </div>

        </div>



        {/* INFO DESKTOP */}
        <div
          className="
            hidden
            lg:flex
            items-center
            gap-8
            text-gray-600
            text-sm
          "
        >

          <div>
            ☎️ 08xxxxxxxxxx
          </div>

          <div>
            ✉️ info@arrahmah48.sch.id
          </div>

          <div>
            📍 Jakarta
          </div>

          <div
            className="
              text-green-700
              text-xl
              font-bold
            "
          >
            f　◎　▶
          </div>

        </div>

      </header>



      {/* MENU */}
      <nav
        className="
          bg-green-800
          text-white
          px-4
          md:px-8
          py-4
          flex
          items-center
          justify-between
          shadow-md
        "
      >

        {/* DESKTOP MENU */}
        <div
          className="
            hidden
            md:flex
            gap-8
            lg:gap-12
            text-lg
          "
        >

          <a
            className="
              border-b-4
              border-yellow-400
              pb-3
              font-semibold
            "
          >
            Beranda
          </a>

          <a>
            Profil⌄
          </a>

          <a>
            Program
          </a>

          <a>
            Galeri
          </a>

          <a>
            Guru
          </a>

          <a>
            Kontak
          </a>

        </div>



        {/* MOBILE */}
        <button
          className="
            md:hidden
            text-3xl
          "
        >
          ☰
        </button>



        {/* PPDB */}
        <button
          className="
            bg-yellow-400
            text-green-900
            font-bold
            px-6
            py-3
            rounded-full
            shadow-lg
            transition
            hover:scale-105
            text-sm
            md:text-base
          "
        >
          👥 PPDB 2026/2027
        </button>


      </nav>

    </>
  );
}