"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const client = createAuthClient();

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const data = new FormData(event.currentTarget);
    const result = await client.signIn.email({ email: String(data.get("email")), password: String(data.get("password")) });
    setLoading(false);
    if (result.error) setError(result.error.message ?? "Login gagal.");
    else { router.push("/admin"); router.refresh(); }
  }
  return <form onSubmit={submit} className="space-y-5" noValidate>
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" required autoComplete="email" className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" /></div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Kata sandi</label><input id="password" name="password" type="password" required autoComplete="current-password" className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100" /></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={loading} className="h-12 w-full rounded-xl bg-teal-700 px-5 font-bold text-white transition hover:bg-teal-600 disabled:opacity-60">{loading ? "Memproses…" : "Masuk"}</button>
  </form>;
}
