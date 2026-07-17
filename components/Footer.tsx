import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Mail } from "lucide-react";

const footerMenus = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Program", href: "/program" },
  { name: "Galeri", href: "/galeri" },
  { name: "Guru", href: "/guru" },
  { name: "Kontak & PPDB", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="relative -mt-12 z-10 bg-transparent px-3 pb-3 font-sans sm:-mt-16 sm:px-5 sm:pb-5">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[48px_48px_28px_28px] border border-white/10 bg-[linear-gradient(135deg,#0F172A_0%,#134E4A_100%)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.24)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(30deg,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[46px] border-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative grid gap-10 px-7 py-12 sm:px-10 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr] lg:px-14 lg:py-14">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 rounded-2xl bg-white/95 p-2 shadow-lg">
                <Image src="/logo.png" alt="Logo TK Islam Ar Rahmah 48" fill className="object-contain p-1" />
              </span>
              <div>
                <p className="text-xl font-extrabold">TK Islam Ar Rahmah 48</p>
                <p className="mt-1 text-sm text-white/[0.78]">Mendidik Generasi Qurani</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/[0.78]">
              Membangun Generasi Qurani yang Ceria, Mandiri, dan Berkarakter.
            </p>
            <Link
              href="/kontak"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.45] bg-transparent px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white hover:text-[#315D3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C969]"
            >
              Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div>
            <h2 className="text-lg font-bold">Menu</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-white/[0.82] lg:grid-cols-1">
              {footerMenus.map((menu) => (
                <li key={menu.href}>
                  <Link href={menu.href} className="rounded-sm transition hover:text-[#F3C969] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C969]">
                    {menu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold">Kontak</h2>
            <a
              href="mailto:info@arrahmah48.sch.id"
              className="mt-5 flex items-start gap-3 break-all text-sm leading-6 text-white/[0.82] transition hover:text-[#F3C969] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C969]"
            >
              <Mail size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              info@arrahmah48.sch.id
            </a>
          </div>

          <div>
            <h2 className="text-lg font-bold">Jam Operasional</h2>
            <div className="mt-5 flex items-start gap-3 text-sm leading-7 text-white/[0.78]">
              <Clock3 size={18} className="mt-1 shrink-0" aria-hidden="true" />
              <p>Senin - Jumat<br />07.30 - 15.00 WIB</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/[0.14] px-7 py-5 text-center text-xs text-white/[0.78] sm:px-10">
          © 2026 TK Islam Ar Rahmah 48. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
