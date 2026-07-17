import { Check } from "lucide-react";

const steps = [
  { label: "Pilih Program", compact: "Program" },
  { label: "Data Anak", compact: "Anak" },
  { label: "Data Orang Tua", compact: "Orang Tua" },
  { label: "Dokumen", compact: "Dokumen" },
  { label: "Review", compact: "Review" },
];

export default function PPDBStepper({ current }: { current: number }) {
  return <ol aria-label="Tahapan pendaftaran" className="grid grid-cols-5 gap-1 border-b border-slate-100 px-3 py-5 sm:gap-2 sm:px-8">
    {steps.map(({ label, compact }, index) => { const done = index < current; const active = index === current; return <li key={label} aria-current={active ? "step" : undefined} className="relative flex min-w-0 flex-col items-center text-center sm:flex-row sm:text-left">
      <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${done ? "border-emerald-500 bg-emerald-500 text-white" : active ? "border-teal-700 bg-teal-700 text-white ring-4 ring-teal-100" : "border-slate-200 bg-white text-slate-400"}`}>{done ? <Check size={17} aria-hidden="true" /> : index + 1}</span>
      <span className={`mt-2 w-full text-[9px] font-semibold leading-3 sm:ml-3 sm:mt-0 sm:w-auto sm:text-xs lg:text-sm ${active ? "text-teal-800" : done ? "text-slate-700" : "text-slate-400"}`}><span className="sm:hidden">{compact}</span><span className="hidden sm:inline">{label}</span></span>
    </li>; })}
  </ol>;
}
