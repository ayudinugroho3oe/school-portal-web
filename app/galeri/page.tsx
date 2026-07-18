import type { Metadata } from "next";
import GalleryExplorer from "../../components/GalleryExplorer";
import { publishedGalleryAlbums } from "../../data/gallery";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description: "Album dokumentasi kegiatan belajar, bermain, berkarya, dan bertumbuh bersama di TK Islam Ar Rahmah 48.",
};

export default function GaleriPage() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5,transparent_34%),radial-gradient(circle_at_top_right,#FEF3C7,transparent_30%),#F8FAFC]">
      <section className="px-5 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700">Dokumentasi Sekolah</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Galeri Kegiatan</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Mengabadikan setiap langkah belajar, bermain, berkarya, dan bertumbuh bersama di TK Islam Ar Rahmah 48.</p>
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-7xl"><GalleryExplorer albums={publishedGalleryAlbums} /></div>
      </section>
    </main>
  );
}
