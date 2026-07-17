export type FormDataState = Record<string, string>;
export type FileState = Record<string, string>;
export type UpdateField = (name: string, value: string) => void;

export const initialFormData: FormDataState = {
  gender: "", religion: "Islam", familyStatus: "Anak Kandung", sameAddress: "false",
  previousSchool: "Belum Pernah", program: "", agreement: "false",
};
