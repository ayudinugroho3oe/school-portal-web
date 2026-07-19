import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentActor } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await getCurrentActor()) redirect("/admin");
  return <div className="mx-auto mt-10 max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-700">School Management System</p>
    <h1 className="mt-3 text-3xl font-black">Masuk ke Admin</h1><p className="mb-7 mt-2 text-slate-600">Gunakan akun resmi yang telah diprovisikan.</p><LoginForm />
  </div>;
}
