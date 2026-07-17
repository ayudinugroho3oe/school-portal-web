"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { getClassProgram } from "../../../data/school-programs";
import PPDBStepper from "./PPDBStepper";
import ProgramStep from "./ProgramStep";
import StudentDataStep from "./StudentDataStep";
import ParentDataStep from "./ParentDataStep";
import ProgramDocumentStep from "./ProgramDocumentStep";
import ReviewStep from "./ReviewStep";
import SuccessState from "./SuccessState";
import { initialFormData, type FileState, type FormDataState } from "./types";

export default function PPDBRegisterForm({ initialProgramId }: { initialProgramId?: string }) {
  const initialProgram = getClassProgram(initialProgramId);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormDataState>(() => ({ ...initialFormData, program: initialProgram?.id ?? "" }));
  const [programLocked, setProgramLocked] = useState(Boolean(initialProgram));
  const [files, setFiles] = useState<FileState>({});
  const [success, setSuccess] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);
  const update = (name: string, value: string) => setData((current) => ({ ...current, [name]: value }));
  const onFile = (name: string, fileName: string) => setFiles((current) => ({ ...current, [name]: fileName }));
  const handleSend = () => { setSuccess(false); setSentNotice(true); window.setTimeout(() => setSentNotice(false), 4000); };
  const editProgram = () => { setProgramLocked(false); setStep(0); };

  return <><section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/95 shadow-[0_24px_70px_rgba(15,118,110,0.10)] backdrop-blur"><PPDBStepper current={step} /><form onSubmit={(event) => { event.preventDefault(); if (step === 0 && !data.program) return; if (step < 4) setStep(step + 1); else setSuccess(true); }}><div className="p-5 sm:p-8 lg:p-10">
    {step === 0 && <ProgramStep programId={data.program} locked={programLocked} update={update} unlock={() => setProgramLocked(false)} />}
    {step === 1 && <StudentDataStep data={data} update={update} />}
    {step === 2 && <ParentDataStep data={data} update={update} />}
    {step === 3 && <ProgramDocumentStep data={data} update={update} files={files} onFile={onFile} />}
    {step === 4 && <ReviewStep data={data} files={files} update={update} onEdit={setStep} onEditProgram={editProgram} />}
  </div><div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-8"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className={`min-h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 font-bold text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${step === 0 ? "invisible" : "inline-flex"}`}><ArrowLeft size={18} aria-hidden="true" />Kembali</button><button type="submit" disabled={step === 0 && !data.program} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-500 px-5 font-bold text-white shadow-[0_12px_28px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:brightness-100">{step === 4 ? <><Send size={18} aria-hidden="true" />Kirim Pendaftaran</> : <>Lanjutkan<ArrowRight size={18} aria-hidden="true" /></>}</button></div></form></section>{success && <SuccessState onClose={() => setSuccess(false)} onSend={handleSend} />}{sentNotice && <div role="status" aria-live="polite" className="fixed right-4 top-24 z-[110] flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 font-semibold text-emerald-800 shadow-[0_18px_50px_rgba(15,23,42,0.18)]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">✓</span><span>Pengiriman berhasil disimulasikan. Data belum tersimpan ke sistem.</span></div>}</>;
}
