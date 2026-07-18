export interface Program {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  about: string;
  objectives: string[];
  activities: string[];
  benefits: string[];
  frequency: string;
}

export interface LearningMoment {
  image: string;
  alt: string;
  caption: string;
}

export const programs: Program[] = [
  {
    id: 1,
    slug: "tahfidz",
    title: "Tahfidz Al-Qur'an",
    description: "Membiasakan anak mencintai Al-Qur'an melalui hafalan dan murojaah yang menyenangkan.",
    image: "/sekolah.jpg",
    about: "Program Tahfidz mengenalkan kedekatan dengan Al-Qur'an melalui suasana belajar yang hangat, pengulangan bertahap, dan pembiasaan adab ketika membaca maupun menyimak ayat.",
    objectives: ["Menumbuhkan kecintaan kepada Al-Qur'an", "Membantu anak mengingat surat pendek secara bertahap", "Membentuk adab saat membaca dan menyimak"],
    activities: ["Hafalan surat pendek", "Murojaah bersama", "Mendengarkan bacaan guru", "Pembiasaan doa dan adab Qurani"],
    benefits: ["Daya ingat terlatih", "Kepercayaan diri bertambah", "Kebiasaan Islami tumbuh sejak dini"],
    frequency: "Dilaksanakan secara rutin sebagai bagian dari pembiasaan belajar sekolah. Rincian pelaksanaan mengikuti program kelas.",
  },
  {
    id: 2,
    slug: "sentra-bermain",
    title: "Sentra Bermain",
    description: "Belajar melalui bermain untuk mengembangkan kreativitas, motorik, dan kemampuan sosial anak.",
    image: "/sekolah2.png",
    about: "Sentra Bermain memberi ruang bagi anak untuk mengeksplorasi ide, benda, peran, dan lingkungan melalui pengalaman bermain yang dirancang sesuai tujuan pembelajaran.",
    objectives: ["Mendorong rasa ingin tahu dan kreativitas", "Mengembangkan kemampuan motorik", "Melatih interaksi dan kerja sama"],
    activities: ["Bermain peran", "Eksplorasi balok dan bentuk", "Permainan sensori", "Kegiatan kelompok terarah"],
    benefits: ["Anak lebih aktif bereksplorasi", "Kemampuan sosial berkembang", "Koordinasi motorik semakin terlatih"],
    frequency: "Dilaksanakan berkala dan terintegrasi dalam kegiatan pembelajaran. Jenis sentra disesuaikan dengan tema kelas.",
  },
  {
    id: 3,
    slug: "english-for-kids",
    title: "English for Kids",
    description: "Pengenalan Bahasa Inggris melalui lagu, cerita, gerak, dan permainan yang menyenangkan.",
    image: "/sekolah3.png",
    about: "English for Kids membangun keberanian anak mengenal dan menggunakan kosakata sederhana dalam konteks yang dekat dengan kehidupan sehari-hari.",
    objectives: ["Mengenalkan kosakata dasar", "Melatih kemampuan menyimak", "Menumbuhkan keberanian berkomunikasi"],
    activities: ["Bernyanyi dalam Bahasa Inggris", "Storytelling interaktif", "Permainan kosakata", "Gerak dan instruksi sederhana"],
    benefits: ["Kosakata anak bertambah", "Pelafalan dan kemampuan menyimak terlatih", "Anak lebih percaya diri mencoba bahasa baru"],
    frequency: "Dilaksanakan secara berkala melalui sesi tematik. Materi mengikuti kesiapan dan konteks pembelajaran anak.",
  },
  {
    id: 4,
    slug: "pembiasaan-ibadah",
    title: "Pembiasaan Ibadah",
    description: "Melatih kemandirian beribadah sejak dini melalui doa harian dan praktik ibadah.",
    image: "/sekolah.png",
    about: "Pembiasaan Ibadah mendampingi anak mengenal tata cara ibadah dan adab sehari-hari melalui contoh, praktik langsung, serta pengulangan yang konsisten.",
    objectives: ["Mengenalkan praktik ibadah dasar", "Membangun kemandirian dan kedisiplinan", "Menanamkan adab Islami dalam keseharian"],
    activities: ["Pembiasaan doa harian", "Praktik wudu", "Latihan gerakan salat", "Penerapan adab sehari-hari"],
    benefits: ["Anak terbiasa beribadah", "Kemandirian berkembang", "Nilai dan adab Islami tertanam melalui praktik"],
    frequency: "Dilaksanakan melalui pembiasaan rutin dan kegiatan praktik terarah sesuai agenda pembelajaran sekolah.",
  },
];

export function getProgram(slug: string) {
  return programs.find((program) => program.slug === slug);
}

export const learningMomentsByProgram: Record<string, { description: string; moments: LearningMoment[] }> = {
  tahfidz: {
    description: "Dokumentasi kegiatan murojaah, hafalan, dan pembiasaan mencintai Al-Qur’an.",
    moments: [
      { image: "/sekolah.jpg", alt: "Anak mengikuti kegiatan murojaah bersama di lingkungan sekolah", caption: "Murojaah bersama sebelum kegiatan belajar dimulai." },
      { image: "/sekolah2.png", alt: "Anak menyimak bacaan Al-Qur'an yang dicontohkan guru", caption: "Melatih kemampuan menyimak melalui bacaan yang dicontohkan secara bertahap." },
      { image: "/sekolah3.png", alt: "Anak membiasakan adab saat kegiatan hafalan Al-Qur'an", caption: "Menumbuhkan adab dan kecintaan kepada Al-Qur’an melalui pembiasaan." },
    ],
  },
  "sentra-bermain": {
    description: "Dokumentasi kegiatan eksplorasi, bermain, berkarya, dan belajar melalui berbagai sentra.",
    moments: [
      { image: "/sekolah2.png", alt: "Anak-anak menyusun balok dalam kegiatan sentra bermain", caption: "Mengembangkan kreativitas dan kemampuan bekerja sama melalui permainan balok." },
      { image: "/sekolah3.png", alt: "Anak mengeksplorasi bentuk dan warna melalui permainan", caption: "Mengenal bentuk, warna, dan hubungan ruang melalui eksplorasi langsung." },
      { image: "/sekolah.jpg", alt: "Anak bermain bersama untuk melatih kemampuan sosial", caption: "Melatih komunikasi, bergiliran, dan pemecahan masalah saat bermain bersama." },
    ],
  },
  "english-for-kids": {
    description: "Dokumentasi pembelajaran Bahasa Inggris melalui lagu, permainan, dan aktivitas interaktif.",
    moments: [
      { image: "/sekolah3.png", alt: "Anak mengenal kosakata Bahasa Inggris melalui aktivitas interaktif", caption: "Mengenal kosakata baru melalui gambar, gerak, dan aktivitas interaktif." },
      { image: "/sekolah.jpg", alt: "Anak berlatih menyimak Bahasa Inggris melalui lagu", caption: "Melatih kemampuan menyimak dan pelafalan melalui lagu sederhana." },
      { image: "/sekolah2.png", alt: "Anak bermain permainan kosakata Bahasa Inggris bersama", caption: "Membangun keberanian berkomunikasi melalui permainan kosakata bersama." },
    ],
  },
  "pembiasaan-ibadah": {
    description: "Dokumentasi pembiasaan ibadah, doa harian, adab, dan praktik keislaman.",
    moments: [
      { image: "/sekolah.png", alt: "Anak mengikuti pembiasaan doa harian di sekolah", caption: "Praktik doa dan adab dalam kegiatan sehari-hari." },
      { image: "/sekolah2.png", alt: "Anak belajar urutan praktik ibadah dengan pendampingan", caption: "Mengenal urutan ibadah melalui contoh dan praktik yang terarah." },
      { image: "/sekolah3.png", alt: "Anak melatih kemandirian dalam pembiasaan ibadah", caption: "Menumbuhkan kemandirian dan kedisiplinan melalui pembiasaan yang konsisten." },
    ],
  },
};
