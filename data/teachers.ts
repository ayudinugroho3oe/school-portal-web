export interface Teacher {
  id: number;
  name: string;
  position: string;
  education: string;
  photo: string;
}

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Siti Aminah, S.Pd",
    position: "Kepala Sekolah",
    education: "S1 Pendidikan Anak Usia Dini",
    photo: "/logo.png",
  },
  {
    id: 2,
    name: "Nur Aisyah, S.Pd",
    position: "Guru Kelompok A",
    education: "S1 PGPAUD",
    photo: "/logo.png",
  },
  {
    id: 3,
    name: "Dewi Lestari, S.Pd",
    position: "Guru Kelompok B",
    education: "S1 PGPAUD",
    photo: "/logo.png",
  },
  {
    id: 4,
    name: "Fitri Handayani",
    position: "Guru Pendamping",
    education: "D3 PAUD",
    photo: "/logo.png",
  },
];
