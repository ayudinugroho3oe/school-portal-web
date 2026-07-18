"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Camera, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { formatGalleryDate, galleryCategories, getAlbumCover, type GalleryAlbum } from "../data/gallery";

const years = [2026, 2025, 2024];

export default function GalleryExplorer({ albums }: { albums: GalleryAlbum[] }) {
  const [category, setCategory] = useState("Semua");
  const [year, setYear] = useState("Semua Tahun");
  const [query, setQuery] = useState("");

  const filteredAlbums = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return albums.filter((album) => {
      const matchesCategory = category === "Semua" || album.category === category;
      const matchesYear = year === "Semua Tahun" || album.year === Number(year);
      const searchable = `${album.title} ${album.category} ${album.description} ${album.year}`.toLocaleLowerCase("id-ID");
      return matchesCategory && matchesYear && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [albums, category, query, year]);

  return (
    <div>
      <section aria-label="Pencarian dan filter album" className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-5">
        <label className="relative block">
          <span className="sr-only">Cari kegiatan</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kegiatan..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10" />
        </label>

        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500"><SlidersHorizontal aria-hidden="true" className="h-4 w-4" />Kategori</div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {["Semua", ...galleryCategories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${category === item ? "border-teal-700 bg-teal-700 text-white shadow-[0_8px_18px_rgba(15,118,110,0.18)]" : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"}`}>{item}</button>)}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {["Semua Tahun", ...years.map(String)].map((item) => <button key={item} type="button" onClick={() => setYear(item)} aria-pressed={year === item} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${year === item ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item}</button>)}
        </div>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div><p className="text-sm font-bold text-teal-700">Album Kegiatan</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Cerita dalam setiap momen</h2></div>
        <p aria-live="polite" className="shrink-0 text-sm font-semibold text-slate-500">{filteredAlbums.length} album</p>
      </div>

      {filteredAlbums.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlbums.map((album, index) => (
            <Link key={album.id} href={`/galeri/${album.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_22px_45px_rgba(15,118,110,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image src={getAlbumCover(album)} alt={`Sampul album ${album.title}`} fill preload={index === 0} sizes="(min-width:1280px) 414px, (min-width:1024px) 30vw, (min-width:768px) 45vw, calc(100vw - 40px)" className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-white/5" />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur"><Camera aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{album.images.length} Foto</span>
                <span className="absolute bottom-4 left-4 rounded-full bg-teal-700/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{album.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays aria-hidden="true" className="h-4 w-4 text-amber-500" />{formatGalleryDate(album.date)}</div>
                <h3 className="mt-3 text-xl font-extrabold text-slate-900 transition group-hover:text-teal-700">{album.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{album.description}</p>
                <span className="mt-5 text-sm font-bold text-teal-700">Buka Album <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Search aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">Album belum ditemukan</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Belum ada album pada kategori dan tahun yang dipilih.</p>
          <button type="button" onClick={() => { setCategory("Semua"); setYear("Semua Tahun"); setQuery(""); }} className="mt-5 rounded-full border border-teal-200 px-4 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Reset filter</button>
        </div>
      )}
    </div>
  );
}
