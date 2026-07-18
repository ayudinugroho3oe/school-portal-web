export const galleryCategories = [
  "Kegiatan Belajar",
  "Keagamaan",
  "Kreativitas",
  "Kegiatan Luar Kelas",
  "Acara Sekolah",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  year: number;
  category: GalleryCategory;
  coverImage?: string;
  images: GalleryImage[];
  status: "published" | "draft";
};

const schoolMoments = {
  learning: "/sekolah.jpg",
  together: "/sekolah2.png",
  activity: "/sekolah3.png",
};

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "album-mpls-2026",
    slug: "mpls-2026",
    title: "MPLS 2026",
    description: "Momen pengenalan lingkungan sekolah bersama guru dan teman baru.",
    date: "2026-07-15",
    year: 2026,
    category: "Acara Sekolah",
    coverImage: schoolMoments.together,
    status: "published",
    images: [
      { id: "mpls-1", src: schoolMoments.together, alt: "Peserta didik mengikuti kegiatan pengenalan lingkungan sekolah", caption: "Mengenal lingkungan sekolah bersama guru dan teman baru." },
      { id: "mpls-2", src: schoolMoments.learning, alt: "Anak-anak mengenal ruang belajar sekolah", caption: "Beradaptasi dengan ruang belajar yang aman dan nyaman." },
      { id: "mpls-3", src: schoolMoments.activity, alt: "Kebersamaan peserta didik pada masa pengenalan sekolah", caption: "Membangun rasa percaya diri melalui kegiatan bersama." },
    ],
  },
  {
    id: "album-lomba-senam-2026",
    slug: "lomba-senam-2026",
    title: "Lomba Senam",
    description: "Kegiatan gerak dan kebugaran yang melatih koordinasi serta kekompakan anak.",
    date: "2026-05-18",
    year: 2026,
    category: "Kegiatan Luar Kelas",
    status: "published",
    images: [
      { id: "senam-1", src: schoolMoments.activity, alt: "Anak-anak mengikuti kegiatan gerak dan senam", caption: "Melatih koordinasi tubuh melalui gerak yang menyenangkan." },
      { id: "senam-2", src: schoolMoments.together, alt: "Peserta didik melakukan kegiatan bersama", caption: "Belajar kompak dan percaya diri bersama teman." },
      { id: "senam-3", src: schoolMoments.learning, alt: "Lingkungan sekolah saat kegiatan peserta didik", caption: "Kegiatan berlangsung di lingkungan sekolah yang nyaman." },
    ],
  },
  {
    id: "album-fashion-show",
    slug: "fashion-show",
    title: "Fashion Show",
    description: "Panggung ekspresi anak untuk menumbuhkan keberanian dan apresiasi terhadap karya.",
    date: "2026-04-21",
    year: 2026,
    category: "Kreativitas",
    status: "published",
    images: [
      { id: "fashion-1", src: schoolMoments.together, alt: "Peserta didik tampil percaya diri dalam kegiatan sekolah", caption: "Menumbuhkan keberanian untuk berekspresi di depan teman." },
      { id: "fashion-2", src: schoolMoments.activity, alt: "Anak-anak mengikuti aktivitas kreativitas", caption: "Mengapresiasi kreativitas dan keunikan setiap anak." },
      { id: "fashion-3", src: schoolMoments.learning, alt: "Suasana sekolah dalam kegiatan kreativitas anak", caption: "Belajar tampil tertib dalam suasana yang suportif." },
    ],
  },
  {
    id: "album-field-trip-2025",
    slug: "field-trip-2025",
    title: "Field Trip",
    description: "Pengalaman belajar kontekstual melalui eksplorasi di luar ruang kelas.",
    date: "2025-11-12",
    year: 2025,
    category: "Kegiatan Luar Kelas",
    status: "published",
    images: [
      { id: "trip-1", src: schoolMoments.activity, alt: "Peserta didik melakukan eksplorasi dalam kegiatan luar kelas", caption: "Mengamati lingkungan secara langsung melalui pengalaman nyata." },
      { id: "trip-2", src: schoolMoments.together, alt: "Anak-anak belajar bersama dalam kegiatan field trip", caption: "Mengembangkan rasa ingin tahu dan kebersamaan." },
      { id: "trip-3", src: schoolMoments.learning, alt: "Lingkungan belajar peserta didik saat kegiatan sekolah", caption: "Menghubungkan pengalaman di luar kelas dengan pembelajaran." },
    ],
  },
  {
    id: "album-pesantren-kilat-2025",
    slug: "pesantren-kilat-ramadan-2025",
    title: "Pesantren Kilat Ramadan",
    description: "Pembiasaan ibadah, doa, dan adab dalam suasana Ramadan yang hangat.",
    date: "2025-03-17",
    year: 2025,
    category: "Keagamaan",
    status: "published",
    images: [
      { id: "ramadan-1", src: schoolMoments.learning, alt: "Peserta didik mengikuti pembiasaan Islami di sekolah", caption: "Mengenal ibadah dan adab melalui pembiasaan sehari-hari." },
      { id: "ramadan-2", src: schoolMoments.together, alt: "Anak-anak mengikuti kegiatan Ramadan bersama", caption: "Menumbuhkan kebersamaan dalam suasana Ramadan." },
      { id: "ramadan-3", src: schoolMoments.activity, alt: "Kegiatan keagamaan peserta didik", caption: "Belajar nilai kebaikan melalui aktivitas yang dekat dengan anak." },
    ],
  },
  {
    id: "album-pentas-seni-2024",
    slug: "pentas-seni-2024",
    title: "Pentas Seni",
    description: "Ruang bagi anak untuk menampilkan karya, gerak, dan ekspresi kreatif.",
    date: "2024-12-14",
    year: 2024,
    category: "Kreativitas",
    status: "published",
    images: [
      { id: "seni-1", src: schoolMoments.activity, alt: "Peserta didik menampilkan kreativitas dalam pentas seni", caption: "Mengekspresikan ide melalui gerak dan karya." },
      { id: "seni-2", src: schoolMoments.together, alt: "Anak-anak tampil bersama pada pentas seni", caption: "Belajar bekerja sama dan saling mendukung." },
      { id: "seni-3", src: schoolMoments.learning, alt: "Suasana kegiatan pentas seni sekolah", caption: "Merayakan proses belajar dan keberanian anak." },
    ],
  },
  {
    id: "album-akhirussanah-2024",
    slug: "akhirussanah-2024",
    title: "Akhirussanah 2024",
    description: "Momen kebersamaan keluarga sekolah dalam menutup perjalanan belajar satu tahun.",
    date: "2024-06-22",
    year: 2024,
    category: "Acara Sekolah",
    status: "published",
    images: [
      { id: "akhir-1", src: schoolMoments.together, alt: "Kebersamaan peserta didik dalam acara akhirussanah", caption: "Mensyukuri proses belajar yang telah dilalui bersama." },
      { id: "akhir-2", src: schoolMoments.activity, alt: "Anak-anak mengikuti rangkaian acara akhirussanah", caption: "Mengabadikan pencapaian dan kebersamaan peserta didik." },
      { id: "akhir-3", src: schoolMoments.learning, alt: "Lingkungan sekolah dalam kegiatan akhir tahun", caption: "Menutup tahun pembelajaran dengan kenangan yang hangat." },
    ],
  },
];

export const publishedGalleryAlbums = galleryAlbums.filter((album) => album.status === "published");

export function getGalleryAlbum(slug: string) {
  return publishedGalleryAlbums.find((album) => album.slug === slug);
}

export function getAlbumCover(album: GalleryAlbum) {
  return album.coverImage || album.images[0]?.src || "/sekolah.jpg";
}

export function formatGalleryDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
