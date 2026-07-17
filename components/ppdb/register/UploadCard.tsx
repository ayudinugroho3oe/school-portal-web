import { FileUp, Upload } from "lucide-react";

export default function UploadCard({ name, label, fileName, onFile }: { name: string; label: string; fileName?: string; onFile: (name: string, fileName: string) => void }) {
  return <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-teal-500 hover:bg-teal-50/40 hover:shadow-[0_14px_32px_rgba(15,118,110,0.09)]">
    <input type="file" name={name} accept=".jpg,.jpeg,.png,.pdf" className="sr-only" onChange={(e) => onFile(name, e.target.files?.[0]?.name ?? "")} />
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><FileUp size={21} aria-hidden="true" /></span>
    <span className="mt-3 text-sm font-bold text-slate-800">{label}</span>
    <span className="mt-1 text-xs text-slate-500">JPG, PNG, atau PDF · Maks. 5 MB</span>
    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700"><Upload size={14} aria-hidden="true" />{fileName || "Pilih File atau tarik ke sini"}</span>
  </label>;
}
