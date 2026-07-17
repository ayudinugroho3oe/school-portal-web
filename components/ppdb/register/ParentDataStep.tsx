import { Field, SectionTitle, SelectField } from "./FormControls";
import type { FormDataState, UpdateField } from "./types";

const education = ["SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "Diploma", "S1", "S2", "S3"];
const income = ["Belum Berpenghasilan", "Di bawah Rp2 juta", "Rp2–5 juta", "Rp5–10 juta", "Di atas Rp10 juta"];

function ParentGroup({ type, title, data, update }: { type: "father" | "mother"; title: string; data: FormDataState; update: UpdateField }) {
  return <section className="rounded-[22px] border border-slate-200 bg-slate-50/60 p-5 sm:p-6"><SectionTitle title={title} /><div className="grid gap-5 md:grid-cols-2">
    <Field label={`Nama Lengkap ${title.replace("Data ", "")}`} name={`${type}Name`} data={data} update={update} required />
    <Field label={`NIK ${title.replace("Data ", "")}`} name={`${type}Nik`} data={data} update={update} placeholder="16 digit NIK" />
    <Field label="Tempat Lahir" name={`${type}BirthPlace`} data={data} update={update} />
    <Field label="Tanggal Lahir" name={`${type}BirthDate`} data={data} update={update} type="date" />
    <SelectField label="Pendidikan Terakhir" name={`${type}Education`} data={data} update={update} options={education} />
    <Field label="Pekerjaan" name={`${type}Job`} data={data} update={update} />
    <SelectField label="Penghasilan Bulanan" name={`${type}Income`} data={data} update={update} options={income} />
    <Field label="Nomor WhatsApp" name={`${type}Whatsapp`} data={data} update={update} placeholder="08xxxxxxxxxx" type="tel" />
  </div></section>;
}

export default function ParentDataStep({ data, update }: { data: FormDataState; update: UpdateField }) {
  return <div className="space-y-7"><ParentGroup type="father" title="Data Ayah" data={data} update={update} /><ParentGroup type="mother" title="Data Ibu" data={data} update={update} />
    <section><SectionTitle title="Kontak Utama" /><div className="grid gap-5 md:grid-cols-2"><Field label="Email Orang Tua" name="parentEmail" data={data} update={update} type="email" placeholder="contoh@email.com" /><Field label="Nomor WhatsApp Utama" name="mainWhatsapp" data={data} update={update} type="tel" placeholder="08xxxxxxxxxx" required /><SelectField label="Hubungan dengan Calon Siswa" name="relationship" data={data} update={update} options={["Ayah", "Ibu", "Wali"]} /><Field label="Nama Wali jika diwakilkan" name="guardianName" data={data} update={update} /></div>
      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><input type="checkbox" checked={data.sameAddress === "true"} onChange={(e) => update("sameAddress", String(e.target.checked))} className="mt-0.5 accent-teal-700" /><span>Alamat orang tua sama dengan alamat calon siswa.</span></label>
    </section>
  </div>;
}
