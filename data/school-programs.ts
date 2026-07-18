export const classPrograms = [
  {
    id: "paud",
    name: "PAUD",
    shortDescription: "Program awal yang berfokus pada kegiatan bermain, stimulasi perkembangan, pembiasaan, dan kemandirian anak.",
    description: "Program awal yang berfokus pada kegiatan bermain, stimulasi motorik, perkembangan bahasa, sosial emosional, pembiasaan, dan kemandirian anak.",
    focusAreas: ["Adaptasi lingkungan sekolah", "Motorik kasar dan halus", "Bahasa dan komunikasi", "Sosial emosional", "Pembiasaan Islami", "Kemandirian dasar"],
    activities: ["Pembiasaan Islami", "Bermain sensori", "Aktivitas motorik", "Bernyanyi dan bercerita", "Kreasi seni", "Latihan kemandirian"],
    image: "/sekolah.jpg",
    accent: "teal",
  },
  {
    id: "tk-a",
    name: "TK A",
    shortDescription: "Program pengembangan kemampuan dasar, kreativitas, komunikasi, keterampilan sosial, dan pembiasaan Islami.",
    description: "Program pengembangan kemampuan dasar, kreativitas, komunikasi, keterampilan sosial, serta pembiasaan nilai-nilai Islami.",
    focusAreas: ["Kemampuan dasar", "Kreativitas", "Komunikasi", "Keterampilan sosial", "Pembiasaan Islami", "Pengenalan literasi dan numerasi"],
    activities: ["Pembiasaan Islami", "Bermain tematik", "Aktivitas motorik", "Kreasi dan eksperimen", "Komunikasi kelompok", "Literasi dan numerasi awal"],
    image: "/sekolah.jpg",
    accent: "emerald",
  },
  {
    id: "tk-b",
    name: "TK B",
    shortDescription: "Program persiapan menuju Sekolah Dasar melalui literasi dan numerasi awal, kemandirian, serta penguatan karakter Islami.",
    description: "Program persiapan menuju Sekolah Dasar melalui literasi dan numerasi awal, kemandirian, kesiapan belajar, serta penguatan karakter Islami.",
    focusAreas: ["Kesiapan masuk SD", "Literasi awal", "Numerasi awal", "Kemandirian", "Kesiapan belajar", "Karakter Islami"],
    activities: ["Pembiasaan Islami", "Proyek kelompok", "Aktivitas motorik", "Kreasi dan pemecahan masalah", "Latihan komunikasi", "Literasi dan numerasi awal"],
    image: "/sekolah.jpg",
    accent: "amber",
  },
] as const;

export type ClassProgramId = (typeof classPrograms)[number]["id"];

export function getClassProgram(id: string | undefined) {
  return classPrograms.find((program) => program.id === id);
}

export interface ClassAlbumImage {
  src: string;
  alt: string;
}

export interface ClassAlbum {
  title: string;
  images: ClassAlbumImage[];
}

const albumSources = ["/sekolah.jpg", "/sekolah2.png", "/sekolah3.png"];
const albumTitles = ["Lingkungan Belajar", "Kegiatan Bersama", "Kreativitas Anak"];

export const classProgramAlbumsByProgram: Record<string, ClassAlbum[]> = Object.fromEntries(
  classPrograms.map((program) => [
    program.id,
    albumTitles.map((title, albumIndex) => ({
      title,
      images: albumSources.map((src, imageIndex) => ({
        src: albumSources[(imageIndex + albumIndex) % albumSources.length],
        alt: `${title} program ${program.name} di TK Islam Ar Rahmah 48`,
      })),
    })),
  ]),
);
