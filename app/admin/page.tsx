import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentActor } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const actor = await getCurrentActor(); if (!actor) redirect("/admin/login");
  return <div><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-700">Dashboard</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">School Management System</h1><p className="mt-3 max-w-2xl text-slate-600">Kelola data internal sekolah melalui modul yang terisolasi dari website publik.</p>
    <div className="mt-8 grid gap-5 md:grid-cols-2"><Link href="/admin/settings/school" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"><span className="text-sm font-bold text-teal-700">Pengaturan</span><h2 className="mt-2 text-xl font-bold">Identitas Sekolah</h2><p className="mt-2 text-slate-600">Lihat dan kelola singleton PRIMARY_SCHOOL sesuai kewenangan peran.</p></Link></div>
  </div>;
}
