"use client";

import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const client = createAuthClient();

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await client.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return <button type="button" onClick={logout} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Keluar</button>;
}
