"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
            <p className="text-lg md:text-3xl font-bold text-green-800">
              TK Islam Ar Rahmah 48
            </p>

            <p className="text-sm md:text-xl text-gray-500">
              Mendidik Generasi Qurani
            </p>
          </div>

        </div>

        <div className="hidden lg:flex items-center gap-8 text-gray-600">
          <a
            href="mailto:info@arrahmah48.sch.id"
            className="rounded-sm hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          >
            ✉️ info@arrahmah48.sch.id
          </a>
        </div>

      </div>

      {/* MENU */}
      <nav className="bg-green-800 text-white">

        <div className="px-4 md:px-8 py-4 flex items-center justify-between">

          {/* Desktop */}
          <div className="hidden md:flex gap-8 lg:gap-12 text-lg">

            {menus.map((menu) => {

              const active = pathname === menu.href;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`rounded-sm pb-3 transition hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 ${
                    active
                      ? "text-yellow-300 border-b-4 border-yellow-400"
                      : ""
                  }`}
                >
                  {menu.name}
                </Link>
              );

            })}

          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden rounded-md text-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            ☰
          </button>

          {/* PPDB */}
          <Link
            href="/kontak"
            className="bg-yellow-400 text-green-900 font-bold px-5 py-3 rounded-full text-sm md:text-base hover:bg-yellow-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            👥 PPDB 2026/2027
          </Link>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (

          <div id="mobile-navigation" className="md:hidden bg-green-700 border-t border-green-600">

            {menus.map((menu) => {

              const active = pathname === menu.href;

              return (

                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-4 border-b border-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-300 ${
                    active
                      ? "bg-green-900 text-yellow-300 font-semibold"
                      : "hover:bg-green-600"
                  }`}
                >
                  {menu.name}
                </Link>

              );

            })}

          </div>

        )}

      </nav>

    </>
  );
}
