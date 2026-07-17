"use client";

import { FormEvent, useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const formData = new FormData(form);
      const name = String(formData.get("name"));
      const email = String(formData.get("email"));
      const message = String(formData.get("message"));
      const subject = encodeURIComponent(`Pertanyaan website dari ${name}`);
      const body = encodeURIComponent(
        `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
      );

      window.location.href = `mailto:info@arrahmah48.sch.id?subject=${subject}&body=${body}`;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate={false}>
      <div>
        <label htmlFor="name" className="mb-2 block font-medium text-gray-700">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={status === "loading"}
          className="w-full rounded-lg border px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={status === "loading"}
          className="w-full rounded-lg border px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-medium text-gray-700">
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          disabled={status === "loading"}
          className="w-full rounded-lg border px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-green-700 px-6 py-3 text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "loading" ? "Menyiapkan email..." : "Kirim Pesan"}
      </button>

      <div aria-live="polite" className="min-h-6 text-sm">
        {status === "success" && (
          <p className="text-green-700">
            Draf email telah disiapkan. Silakan selesaikan pengiriman melalui aplikasi email Anda.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-700">
            Aplikasi email tidak dapat dibuka. Silakan kirim langsung ke info@arrahmah48.sch.id.
          </p>
        )}
      </div>
    </form>
  );
}
