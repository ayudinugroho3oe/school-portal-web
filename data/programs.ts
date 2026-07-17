export interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const programs: Program[] = [
  {
    id: 1,
    title: "Tahfidz Al-Qur'an",
    description:
      "Membiasakan anak mencintai Al-Qur'an melalui hafalan dan murojaah setiap hari.",
    image: "/sekolah.jpg",
  },
  {
    id: 2,
    title: "Sentra Bermain",
    description:
      "Belajar melalui bermain untuk mengembangkan kreativitas, motorik, dan sosial anak.",
    image: "/sekolah.jpg",
  },
  {
    id: 3,
    title: "English for Kids",
    description:
      "Pengenalan Bahasa Inggris dengan metode menyenangkan melalui lagu dan permainan.",
    image: "/sekolah.jpg",
  },
  {
    id: 4,
    title: "Pembiasaan Ibadah",
    description:
      "Melatih kemandirian beribadah sejak dini melalui doa harian dan praktik ibadah.",
    image: "/sekolah.jpg",
  },
];
