import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Mail } from "lucide-react";
import { SCHOOL_CONTACT, SCHOOL_WHATSAPP_URL } from "../config/school-contact";
import WhatsAppIcon from "./WhatsAppIcon";
import type { PublicSchoolContent } from "@/lib/public-school-content";

const footerMenus = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Program", href: "/program" },
  { name: "Galeri", href: "/galeri" },
  { name: "Guru", href: "/guru" },
  { name: "Kontak & PPDB", href: "/ppdb/register" },
];

export default function Footer({ content }: { content: PublicSchoolContent }) {
  const whatsappUrl = content.whatsapp ? `https://wa.me/${content.whatsapp}` : SCHOOL_WHATSAPP_URL;
  return (
    <footer className="relative z-10 bg-transparent px-3 pb-3 pt-8 font-sans sm:px-5 sm:pb-5 sm:pt-10">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[48px_48px_28px_28px] border border-white/10 bg-[linear-gradient(135deg,#0F172A_0%,#134E4A_100%)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.24)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(30deg,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(150deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[46px] border-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative grid gap-8 px-7 py-10 sm:px-10 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr] lg:gap-10 lg:px-14 lg:py-12">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 rounded-2xl bg-white/95 p-2 shadow-lg">
                <Image src={content.logoUrl} alt={`Logo ${content.schoolName}`} fill sizes="64px" className="object-contain p-1" unoptimized={content.logoUrl.startsWith("http")} />
              </span>
              <div>
                <p className="text-xl font-extrabold">{content.schoolName}</p>
                <p className="mt-1 text-sm text-white/[0.78]">{content.tagline}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/[0.78]">
              {content.motto}
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
              href={`mailto:${content.email}`}
              className="mt-5 flex items-start gap-3 break-all text-sm leading-6 text-white/[0.82] transition hover:text-[#F3C969] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C969]"
            >
              <Mail size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              {content.email}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-start gap-3 text-sm leading-6 text-white/[0.82] transition hover:text-[#F3C969] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C969]"
            >
              <WhatsAppIcon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
              <span><span className="block font-semibold text-white">WhatsApp</span>{content.whatsappDisplay || SCHOOL_CONTACT.whatsappDisplay}</span>
            </a>
          </div>

          <div>
            <h2 className="text-lg font-bold">Jam Operasional</h2>
            <div className="mt-5 flex items-start gap-3 text-sm leading-7 text-white/[0.78]">
              <Clock3 size={18} className="mt-1 shrink-0" aria-hidden="true" />
              <p className="whitespace-pre-line">{content.operatingHours}</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/[0.14] px-7 py-5 text-center text-xs text-white/[0.78] sm:px-10">
          © 2026 {content.schoolName}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
