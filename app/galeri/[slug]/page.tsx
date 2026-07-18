import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Camera, ChevronRight } from "lucide-react";
import GalleryLightbox from "../../../components/GalleryLightbox";
import { formatGalleryDate, getAlbumCover, getGalleryAlbum, publishedGalleryAlbums } from "../../../data/gallery";

export function generateStaticParams() {
  return publishedGalleryAlbums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: PageProps<"/galeri/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const album = getGalleryAlbum(slug);
  if (!album) return { title: "Album Tidak Ditemukan" };
  return { title: `${album.title} | Galeri`, description: album.description };
}

export default async function GalleryAlbumPage({ params }: PageProps<"/galeri/[slug]">) {
  const { slug } = await params;
  const album = getGalleryAlbum(slug);
  if (!album) notFound();
  const otherAlbums = publishedGalleryAlbums.filter((item) => item.slug !== album.slug).slice(0, 3);

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#ECFDF5,transparent_32%),#F8FAFC]">
      <section className="px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <Link href="/" className="transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Beranda</Link><ChevronRight aria-hidden="true" className="h-4 w-4" />
            <Link href="/galeri" className="transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Galeri</Link><ChevronRight aria-hidden="true" className="h-4 w-4" />
            <span aria-current="page" className="text-slate-800">{album.title}</span>
          </nav>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <span className="inline-flex rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold text-teal-800">{album.category}</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{album.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">{album.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4 text-amber-500" />{formatGalleryDate(album.date)}</span>
                <span className="inline-flex items-center gap-2"><Camera aria-hidden="true" className="h-4 w-4 text-teal-700" />{album.images.length} Foto</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white bg-slate-100 shadow-[0_20px_55px_rgba(15,118,110,0.12)]">
              <Image src={getAlbumCover(album)} alt={`Sampul album ${album.title}`} fill preload sizes="(min-width:1280px) 674px, (min-width:1024px) 53vw, calc(100vw - 40px)" className="object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-white/5" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700">Dokumentasi Album</p><h2 className="mt-2 text-3xl font-extrabold text-slate-900">Momen Kegiatan</h2></div>
          <GalleryLightbox images={album.images} />
        </div>
      </section>

      <section className="border-t border-slate-200/70 bg-white px-5 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold text-teal-700">Jelajahi Dokumentasi</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">Album Lainnya</h2></div><Link href="/galeri" className="rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">Kembali ke Galeri</Link></div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">{otherAlbums.map((item) => <Link key={item.id} href={`/galeri/${item.slug}`} className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,118,110,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"><div className="relative aspect-[16/9] overflow-hidden"><Image src={getAlbumCover(item)} alt={`Sampul album ${item.title}`} fill loading="lazy" sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-4"><p className="text-xs font-bold text-teal-700">{item.category}</p><h3 className="mt-1 text-lg font-extrabold text-slate-900">{item.title}</h3></div></Link>)}</div>
        </div>
      </section>
    </main>
  );
}
