"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menus = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Program", href: "/program" },
    { name: "Galeri", href: "/galeri" },
    { name: "Guru", href: "/guru" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <>
      {/* HEADER */}
      <div className="bg-[#e8f5e9] px-4 md:px-8 py-2 md:py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-[60px] h-[60px] md:w-[80px] md:h-[80px] flex-shrink-0">
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
      <nav className="bg-green-800 text-white px-4 md:px-8 py-4 flex items-center justify-between">

        <div className="hidden md:flex gap-8 lg:gap-12 text-lg">

          {menus.map((menu) => {
            const active = pathname === menu.href;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`
                  pb-3
                  transition
                  hover:text-yellow-300
                  ${
                    active
                      ? "text-yellow-300 border-b-4 border-yellow-400"
                      : ""
                  }
                `}
              >
                {menu.name}
              </Link>
            );
          })}

        </div>

        {/* MOBILE */}
        <button className="md:hidden text-3xl">
          ☰
        </button>

        {/* PPDB */}
        <button className="bg-yellow-400 text-green-900 font-bold px-5 py-3 rounded-full text-sm md:text-base hover:bg-yellow-300 transition">
          👥 PPDB 2026/2027
        </button>

      </nav>
    </>
  );
}