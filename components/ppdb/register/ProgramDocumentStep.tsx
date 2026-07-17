import { Field, SectionTitle, TextAreaField } from "./FormControls";
import UploadCard from "./UploadCard";
import type { FileState, FormDataState, UpdateField } from "./types";
const documents = [["birthCertificate","Akta Kelahiran"],["familyCard","Kartu Keluarga"],["studentPhoto","Pas Foto Anak"],["fatherId","KTP Ayah"],["motherId","KTP Ibu"],["childId","Kartu Identitas Anak jika tersedia"]];

export default function ProgramDocumentStep({ data, update, files, onFile }: { data: FormDataState; update: UpdateField; files: FileState; onFile: (name: string, fileName: string) => void }) {
  return <div><SectionTitle title="Dokumen dan Riwayat Sekolah" description="Lengkapi riwayat sekolah dan pilih dokumen pendukung yang tersedia." />
    <SectionTitle title="Asal Sekolah" />
    <fieldset><legend className="text-sm font-semibold text-slate-700">Apakah sebelumnya pernah bersekolah?</legend><div className="mt-3 flex flex-wrap gap-3">{["Belum Pernah", "Pernah"].map((option) => <label key={option} className={`cursor-pointer rounded-2xl border px-5 py-3 text-sm font-semibold ${data.previousSchool === option ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-600"}`}><input type="radio" className="mr-2 accent-teal-700" checked={data.previousSchool === option} onChange={() => update("previousSchool", option)} />{option}</label>)}</div></fieldset>
    {data.previousSchool === "Pernah" && <div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Nama Sekolah Sebelumnya" name="previousSchoolName" data={data} update={update} /><TextAreaField label="Alasan Pindah atau Catatan" name="transferNote" data={data} update={update} /></div>}
    <div className="my-8 h-px bg-slate-100" /><SectionTitle title="Dokumen" description="Upload bersifat demonstrasi dan tidak dikirim ke server." />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{documents.map(([name,label]) => <UploadCard key={name} name={name} label={label} fileName={files[name]} onFile={onFile} />)}</div>
  </div>;
}
