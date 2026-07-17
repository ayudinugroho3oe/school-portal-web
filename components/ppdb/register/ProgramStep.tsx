import { Baby, BookOpenCheck, GraduationCap, LockKeyhole } from "lucide-react";
import { classPrograms, getClassProgram } from "../../../data/school-programs";
import { SectionTitle } from "./FormControls";
import type { UpdateField } from "./types";

const programIcons = [Baby, BookOpenCheck, GraduationCap];

export default function ProgramStep({ programId, locked, update, unlock }: { programId: string; locked: boolean; update: UpdateField; unlock: () => void }) {
  const selected = getClassProgram(programId);

  if (locked && selected) {
    const Icon = programIcons[classPrograms.findIndex((program) => program.id === selected.id)];
    return <div><SectionTitle title="Program yang Dipilih" description={`Anda memulai pendaftaran melalui halaman Program ${selected.name}.`} />
      <div className="rounded-[22px] border-2 border-teal-600 bg-teal-50 p-6 shadow-[0_12px_30px_rgba(15,118,110,0.10)]">
        <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm"><Icon size={23} aria-hidden="true" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold text-slate-900">{selected.name}</h2><span className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white"><LockKeyhole size={12} aria-hidden="true" />Terpilih</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{selected.shortDescription}</p></div></div>
      </div>
      <button type="button" onClick={unlock} className="mt-4 rounded-lg text-sm font-bold text-teal-700 underline decoration-teal-300 underline-offset-4 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Ubah Pilihan Program</button>
    </div>;
  }

  return <div><SectionTitle title="Pilih Program" description="Pilih kelompok kelas sebelum melanjutkan pengisian data calon siswa." />
    <fieldset><legend className="sr-only">Pilihan program</legend><div className="grid gap-4 md:grid-cols-3">{classPrograms.map((program, index) => { const Icon = programIcons[index]; const checked = programId === program.id; return <label key={program.id} className={`relative cursor-pointer rounded-[22px] border p-5 transition duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 ${checked ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600/10" : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-lg"}`}><input type="radio" name="program" value={program.id} checked={checked} onChange={() => update("program", program.id)} className="absolute right-5 top-5 h-4 w-4 accent-teal-700" /><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Icon size={21} aria-hidden="true" /></span><span className="mt-4 block font-bold text-slate-900">{program.name}</span><span className="mt-2 block text-sm leading-6 text-slate-500">{program.shortDescription}</span></label>; })}</div></fieldset>
  </div>;
}
