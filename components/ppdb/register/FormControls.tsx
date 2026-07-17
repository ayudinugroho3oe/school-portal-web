import type { ChangeEvent, ReactNode } from "react";
import type { FormDataState, UpdateField } from "./types";

const base = "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

export function Field({ label, name, data, update, type = "text", placeholder, required, children }: { label: string; name: string; data: FormDataState; update: UpdateField; type?: string; placeholder?: string; required?: boolean; children?: ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700"><span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span>{children ?? <input id={name} name={name} type={type} value={data[name] ?? ""} placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>) => update(name, e.target.value)} className={`${base} mt-2`} />}</label>;
}

export function SelectField({ label, name, data, update, options, required }: { label: string; name: string; data: FormDataState; update: UpdateField; options: string[]; required?: boolean }) {
  return <label className="block text-sm font-semibold text-slate-700"><span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span><select id={name} name={name} value={data[name] ?? ""} onChange={(e) => update(name, e.target.value)} className={`${base} mt-2`}><option value="">Pilih opsi</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export function TextAreaField({ label, name, data, update, placeholder }: { label: string; name: string; data: FormDataState; update: UpdateField; placeholder?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<textarea id={name} name={name} rows={4} value={data[name] ?? ""} placeholder={placeholder} onChange={(e) => update(name, e.target.value)} className={`${base} mt-2 resize-y py-3`} /></label>;
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return <div className="mb-6"><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>{description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}</div>;
}
