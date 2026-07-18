"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClassAlbum } from "../data/school-programs";

const SWIPE_THRESHOLD = 45;

function AlbumCard({ album, openLightbox }: { album: ClassAlbum; openLightbox: (album: ClassAlbum, index: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const previous = () => setActiveIndex((current) => (current - 1 + album.images.length) % album.images.length);
  const next = () => setActiveIndex((current) => (current + 1) % album.images.length);
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) next();
      else previous();
    }
    touchStartX.current = null;
  };

  return <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"><div className="relative h-48 touch-pan-y overflow-hidden"><button type="button" onClick={() => openLightbox(album, activeIndex)} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)} aria-label={`Buka foto ${activeIndex + 1} dari album ${album.title}`} className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600"><span className="sr-only">Buka album {album.title}</span></button>{album.images.map((image, index) => <Image key={`${album.title}-${image.src}-${index}`} src={image.src} alt={index === activeIndex ? image.alt : ""} fill loading="lazy" sizes="(min-width:768px) 33vw, 100vw" className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`} />)}<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950/20 via-transparent to-slate-950/5" /><span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-slate-950/65 px-3 py-1.5 text-xs font-bold tabular-nums text-white backdrop-blur">{activeIndex + 1} / {album.images.length}</span><button type="button" onClick={previous} aria-label={`Foto sebelumnya pada ${album.title}`} className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 md:opacity-0 md:group-hover:opacity-100"><ChevronLeft size={20} aria-hidden="true" /></button><button type="button" onClick={next} aria-label={`Foto berikutnya pada ${album.title}`} className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 md:opacity-0 md:group-hover:opacity-100"><ChevronRight size={20} aria-hidden="true" /></button><div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">{album.images.map((image, index) => <span key={`dot-${album.title}-${image.src}-${index}`} className={`h-1.5 rounded-full border border-white/80 transition-all duration-300 ${index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/45"}`} />)}</div></div><h3 className="p-5 font-bold text-slate-900">{album.title}</h3></article>;
}

export default function ClassAlbumSlider({ albums }: { albums: ClassAlbum[] }) {
  const [lightbox, setLightbox] = useState<{ album: ClassAlbum; index: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const close = useCallback(() => setLightbox(null), []);
  const previous = useCallback(() => setLightbox((current) => current ? { ...current, index: (current.index - 1 + current.album.images.length) % current.album.images.length } : null), []);
  const next = useCallback(() => setLightbox((current) => current ? { ...current, index: (current.index + 1) % current.album.images.length } : null), []);

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, lightbox, next, previous]);

  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) next();
      else previous();
    }
    touchStartX.current = null;
  };

  const activeImage = lightbox?.album.images[lightbox.index];
  return <><div className="mt-16 grid gap-5 md:grid-cols-3">{albums.map((album) => <AlbumCard key={album.title} album={album} openLightbox={(selectedAlbum, index) => setLightbox({ album: selectedAlbum, index })} />)}</div>{lightbox && activeImage && <div role="dialog" aria-modal="true" aria-label={`Album ${lightbox.album.title}`} className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}><button type="button" onClick={close} aria-label="Tutup lightbox" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X aria-hidden="true" /></button><button type="button" onClick={previous} aria-label="Foto sebelumnya" className="absolute left-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"><ChevronLeft aria-hidden="true" /></button><div className="w-full max-w-5xl"><div className="relative aspect-[4/3] max-h-[76vh] overflow-hidden rounded-[24px] bg-slate-900"><Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="object-contain" /></div><div className="mt-4 text-center"><p className="font-bold text-white">{lightbox.album.title}</p><p className="mt-1 text-xs font-bold tabular-nums text-white/60">{lightbox.index + 1} / {lightbox.album.images.length}</p></div></div><button type="button" onClick={next} aria-label="Foto berikutnya" className="absolute right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"><ChevronRight aria-hidden="true" /></button></div>}</>;
}
