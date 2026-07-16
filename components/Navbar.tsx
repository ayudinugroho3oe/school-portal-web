import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      {/* HEADER */}
      <div
        className="
          bg-[#e8f5e9]
          px-4
          md:px-8
          py-2
          md:py-3
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              relative
              w-[60px]
              h-[60px]
              md:w-[80px]
              md:h-[80px]
              flex-shrink-0
            "
          >
            <Image
              src="/logo.png"
              alt="Logo TK"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg md:text-3xl font-bold text-green-800">
              TK Islam Ar Rahmah 48
            </h1>

            <p className="text-sm md:text-xl text-gray-500">
              Mendidik Generasi Qurani
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-gray-600">
          <div>☎️ 08xxxxxxxxxx</div>
          <div>✉️ info@arrahmah48.sch.id</div>
          <div>📍 Jakarta</div>

          <div className="text-green-700 text-xl">
            f ◎ ▶
          </div>
        </div>
      </div>

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
        "
      >
        <div
          className="
            hidden
            md:flex
            gap-8
            lg:gap-12
            text-lg
          "
        >
          <Link
            href="/"
            className="border-b-4 border-yellow-400 pb-3 hover:text-yellow-300 transition"
          >
            Beranda
          </Link>

          <Link
            href="/profil"
            className="hover:text-yellow-300 transition"
          >
            Profil
          </Link>

          <a className="cursor-pointer hover:text-yellow-300 transition">
            Program
          </a>

          <a className="cursor-pointer hover:text-yellow-300 transition">
            Galeri
          </a>

          <a className="cursor-pointer hover:text-yellow-300 transition">
            Guru
          </a>

          <a className="cursor-pointer hover:text-yellow-300 transition">
            Kontak
          </a>
        </div>

        {/* MOBILE */}
        <button className="md:hidden text-3xl">
          ☰
        </button>

        <button
          className="
            bg-yellow-400
            text-green-900
            font-bold
            px-5
            py-3
            rounded-full
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