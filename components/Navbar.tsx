import Image from "next/image";

export default function Navbar() {
  return (
    <>
      {/* TOP HEADER */}
      <div className="bg-white px-8 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo TK"
            width={80}
            height={80}
          />

          <div>
            <h1 className="text-3xl font-bold text-green-800">
              TK Islam Ar Rahmah 48
            </h1>
            <p className="text-xl text-gray-500">
              Mendidik Generasi Qurani
            </p>
          </div>
        </div>


        <div className="hidden md:flex items-center gap-8 text-gray-600">

          <div>
            ☎️ 08xxxxxxxxxx
          </div>

          <div>
            ✉️ info@arrahmah48.sch.id
          </div>

          <div>
            📍 Jakarta
          </div>

          <div className="text-green-700 text-xl">
            f　◎　▶
          </div>

        </div>

      </div>


      {/* MENU */}
      <nav className="bg-green-800 text-white px-8 py-4 flex items-center justify-between">

        <div className="flex gap-12 text-lg">

          <a className="border-b-4 border-yellow-400 pb-3">
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


        <button className="bg-yellow-400 text-green-900 font-bold px-8 py-3 rounded-full">
          👥 PPDB 2026/2027
        </button>


      </nav>
    </>
  );
}