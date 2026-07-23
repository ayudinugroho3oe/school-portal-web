"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import LogoutButton from "./LogoutButton";

const links = [{ href: "/admin", label: "Ringkasan" }, { href: "/admin/cms/identity", label: "CMS · Identity" }, { href: "/admin/cms/school-profile", label: "CMS · School Profile" }, { href: "/admin/settings/school", label: "Pengaturan" }];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="fixed inset-0 z-[200] overflow-auto bg-slate-50 text-slate-900">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/admin" className="font-bold text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4">SMS Ar Rahmah 48</Link>
        <nav aria-label="Navigasi admin" className="flex gap-2">
          {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${pathname === link.href ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-100"}`}>{link.label}</Link>)}
          {pathname !== "/admin/login" && <LogoutButton />}
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
  </div>;
}
