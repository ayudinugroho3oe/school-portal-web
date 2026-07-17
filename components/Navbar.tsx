"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const menus = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Program", href: "/program" },
  { name: "Galeri", href: "/galeri" },
  { name: "Guru", href: "/guru" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
      <header className="sticky top-0 z-50 bg-[#FCFBF7]/88 py-2 font-sans backdrop-blur-xl">
      <nav aria-label="Navigasi utama" className="mx-auto max-w-[1320px] px-3 sm:px-5 lg:px-6">
        <div className="relative overflow-hidden rounded-[24px] border border-white bg-white/95 px-4 py-2.5 shadow-[0_12px_34px_rgba(15,81,50,0.10)] sm:px-5 lg:px-7">
          <div className="pointer-events-none absolute -left-10 -top-16 h-24 w-40 rotate-12 rounded-full bg-green-100/45 blur-2xl" />
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
            >
              <span className="relative h-10 w-10 shrink-0 sm:h-11 sm:w-11">
                <Image src="/logo.png" alt="Logo TK Islam Ar Rahmah 48" fill className="object-contain" preload />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold tracking-tight text-green-800 sm:text-lg">
                  TK Islam Ar Rahmah 48
                </span>
                <span className="block truncate text-xs text-slate-500 sm:text-sm">
                  Mendidik Generasi Qurani
                </span>
              </span>
            </Link>

            <div className="hidden items-center lg:ml-12 lg:flex lg:flex-1 xl:ml-16">
              <div className="relative flex w-full items-center justify-between rounded-[18px] border border-white/90 bg-[linear-gradient(180deg,rgba(252,251,247,0.96),rgba(238,246,241,0.72))] p-1.5 shadow-[inset_0_1px_2px_rgba(47,111,85,0.05),0_6px_18px_rgba(47,111,85,0.04)]">
                {menus.map((menu) => {
                  const active = pathname === menu.href;
                  return (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-[13px] px-4 py-2 text-[15px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 ${
                        active
                          ? "-translate-y-0.5 bg-white text-green-700 shadow-[0_7px_16px_rgba(15,81,50,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-green-100"
                          : "text-slate-600 hover:-translate-y-0.5 hover:bg-white/80 hover:text-green-700 hover:shadow-[0_5px_12px_rgba(15,81,50,0.08)]"
                      }`}
                    >
                      {menu.name}
                      {active && <span className="absolute inset-x-5 -bottom-0.5 h-0.5 rounded-full bg-[#F4C453]" />}
                    </Link>
                  );
                })}
              </div>

            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-800 transition hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 lg:hidden"
            >
              {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {menuOpen && (
            <div id="mobile-navigation" className="mt-4 border-t border-slate-100 pt-3 lg:hidden">
              <div className="grid gap-1">
                {menus.map((menu) => {
                  const active = pathname === menu.href;
                  return (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 ${
                        active ? "bg-green-50 text-green-800" : "text-slate-600 hover:bg-slate-50 hover:text-green-700"
                      }`}
                    >
                      {menu.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
      </header>
  );
}
