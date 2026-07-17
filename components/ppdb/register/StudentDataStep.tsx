import { Field, SectionTitle, SelectField, TextAreaField } from "./FormControls";
import type { FormDataState, UpdateField } from "./types";

export default function StudentDataStep({ data, update }: { data: FormDataState; update: UpdateField }) {
  return <div><SectionTitle title="Data Calon Siswa" description="Masukkan identitas anak sesuai dokumen resmi." />
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Nama Lengkap" name="studentName" data={data} update={update} placeholder="Nama lengkap sesuai akta kelahiran" required />
      <Field label="Nama Panggilan" name="nickname" data={data} update={update} placeholder="Nama panggilan anak" />
      <Field label="Nomor Induk Kependudukan / NIK" name="studentNik" data={data} update={update} placeholder="16 digit NIK" required />
      <fieldset><legend className="text-sm font-semibold text-slate-700">Jenis Kelamin <span className="text-red-500">*</span></legend><div className="mt-2 grid grid-cols-2 gap-3">{["Laki-laki", "Perempuan"].map((option) => <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition ${data.gender === option ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600/10" : "border-slate-200 bg-white hover:border-teal-300"}`}><input type="radio" name="gender" value={option} checked={data.gender === option} onChange={() => update("gender", option)} className="accent-teal-700" /><span className="text-sm font-medium">{option}</span></label>)}</div></fieldset>
      <Field label="Tempat Lahir" name="birthPlace" data={data} update={update} placeholder="Kota kelahiran" />
      <Field label="Tanggal Lahir" name="birthDate" data={data} update={update} type="date" required />
      <SelectField label="Agama" name="religion" data={data} update={update} options={["Islam"]} />
      <Field label="Anak ke-" name="childOrder" data={data} update={update} type="number" placeholder="Contoh: 1" />
      <Field label="Jumlah Saudara Kandung" name="siblings" data={data} update={update} type="number" placeholder="Contoh: 2" />
      <SelectField label="Status dalam Keluarga" name="familyStatus" data={data} update={update} options={["Anak Kandung", "Anak Angkat", "Anak Tiri"]} />
    </div>
    <div className="my-8 h-px bg-slate-100" /><SectionTitle title="Alamat Calon Siswa" />
    <div className="grid gap-5 md:grid-cols-2"><div className="md:col-span-2"><TextAreaField label="Alamat Lengkap" name="address" data={data} update={update} placeholder="Nama jalan, nomor rumah, dan patokan" /></div>
      {[["RT","rt"],["RW","rw"],["Kelurahan","village"],["Kecamatan","district"],["Kota/Kabupaten","city"],["Provinsi","province"],["Kode Pos","postalCode"]].map(([label,name]) => <Field key={name} label={label} name={name} data={data} update={update} />)}
    </div>
  </div>;
}
