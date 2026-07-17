export interface Testimonial {
  id: number;
  name: string;
  relation: string;
  message: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ibu Siti",
    relation: "Orang Tua Aisyah",
    message:
      "Guru-gurunya sangat ramah dan sabar. Anak saya menjadi lebih percaya diri dan senang belajar.",
  },
  {
    id: 2,
    name: "Bapak Andi",
    relation: "Orang Tua Rafi",
    message:
      "Lingkungan sekolah bersih, nyaman, dan pembelajaran Islami diterapkan dengan baik.",
  },
  {
    id: 3,
    name: "Ibu Rina",
    relation: "Orang Tua Nabila",
    message:
      "Program belajarnya menarik dan komunikasi dengan orang tua sangat baik.",
  },
];