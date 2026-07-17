import Link from "next/link";
import { CheckCircle2, Send, X } from "lucide-react";

export default function SuccessState({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirmation-title" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-[24px] border border-white/70 bg-white p-7 text-center shadow-[0_30px_80px_rgba(15,23,42,0.24)] sm:p-10">
        <button type="button" onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><X size={20} /></button>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={32} aria-hidden="true" /></span>
        <h2 id="confirmation-title" className="mt-5 text-2xl font-extrabold text-slate-900">Konfirmasi Data Pendaftaran</h2>
        <p className="mt-3 leading-7 text-slate-500">Klik Kirim Data untuk menyelesaikan simulasi pendaftaran.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href="/ppdb" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-teal-700 px-5 font-bold text-teal-700 hover:bg-teal-50">Kembali ke Halaman PPDB</Link>
          <button type="button" onClick={onSend} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-500 px-5 font-bold text-white shadow-lg"><Send size={17} aria-hidden="true" />Kirim Data</button>
        </div>
      </div>
    </div>
  );
}
