import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Camera, ArrowRight } from "lucide-react";
import { formatGalleryDate, getAlbumCover, publishedGalleryAlbums } from "../data/gallery";

const latestAlbums = [...publishedGalleryAlbums]
  .sort((first, second) => second.date.localeCompare(first.date))
  .slice(0, 3);

export default function Gallery() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ECFDF5_0%,#F8FAFC_100%)] px-5 py-16 sm:px-6 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 sm:text-sm">Galeri</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Momen Kegiatan Sekolah</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">Lihat berbagai kegiatan belajar, bermain, berkarya, dan kebersamaan peserta didik TK Islam Ar Rahmah 48.</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latestAlbums.map((album, index) => (
            <Link key={album.id} href={`/galeri/${album.slug}`} className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_22px_45px_rgba(15,118,110,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image src={getAlbumCover(album)} alt={`Sampul album ${album.title}`} fill preload={index === 0} sizes="(min-width:1280px) 414px, (min-width:1024px) 30vw, (min-width:768px) 45vw, calc(100vw - 40px)" className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-white/5" />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur"><Camera aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{album.images.length} Foto</span>
                <span className="absolute bottom-4 left-4 rounded-full bg-teal-700/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{album.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays aria-hidden="true" className="h-4 w-4 text-amber-500" />{formatGalleryDate(album.date)}</div>
                <h3 className="mt-3 text-xl font-extrabold text-slate-900 transition group-hover:text-teal-700">{album.title}</h3>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Lihat Album <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link href="/galeri" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-teal-600 bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-[0_12px_28px_rgba(15,118,110,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3">Lihat Semua Galeri <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
