"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LearningMoment } from "../data/programs";

const SWIPE_THRESHOLD = 45;

export default function LearningMoments({ description, moments }: { description: string; moments: LearningMoment[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeMoment = moments[activeIndex];

  const previous = useCallback(() => setActiveIndex((current) => (current - 1 + moments.length) % moments.length), [moments.length]);
  const next = useCallback(() => setActiveIndex((current) => (current + 1) % moments.length), [moments.length]);
  const close = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, lightboxOpen, next, previous]);

  const startSwipe = (clientX: number) => { touchStartX.current = clientX; };
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) next();
      else previous();
    }
    touchStartX.current = null;
  };

  if (!activeMoment) return null;

  return <section className="px-5 py-20 sm:px-6 lg:py-24"><div className="mx-auto max-w-[1120px]"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Galeri Kegiatan</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Momen Pembelajaran</h2><p className="mt-4 leading-7 text-slate-600">{description}</p></div><span className="w-fit rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold tabular-nums text-teal-700 shadow-sm">{activeIndex + 1} / {moments.length} Momen</span></div>

    <div className="group/gallery relative mt-9"><button type="button" onClick={() => setLightboxOpen(true)} onTouchStart={(event) => startSwipe(event.touches[0].clientX)} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)} aria-label={`Perbesar foto: ${activeMoment.caption}`} className="relative block aspect-[16/10] w-full touch-pan-y cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:aspect-[16/9]">{moments.map((moment, index) => <span key={`${moment.image}-${moment.caption}`} aria-hidden={index !== activeIndex} className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}><Image src={moment.image} alt={index === activeIndex ? moment.alt : ""} fill preload={index === 0} sizes="(min-width:1120px) 1120px, 100vw" className="object-cover" /></span>)}<span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/28 via-transparent to-white/5" /></button>
      <button type="button" onClick={previous} aria-label="Momen sebelumnya" className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-300 hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 group-hover/gallery:opacity-100 md:flex"><ChevronLeft aria-hidden="true" /></button><button type="button" onClick={next} aria-label="Momen berikutnya" className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-300 hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 group-hover/gallery:opacity-100 md:flex"><ChevronRight aria-hidden="true" /></button>
    </div>

    <div className="relative mt-5 min-h-16 overflow-hidden" aria-live="polite">{moments.map((moment, index) => <p key={`caption-${moment.caption}`} className={`absolute inset-x-0 top-0 text-sm font-semibold leading-7 text-slate-700 transition-opacity duration-500 motion-reduce:transition-none sm:text-base ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}>{moment.caption}</p>)}</div>

    <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-3 pt-2 [scrollbar-width:thin]">{moments.map((moment, index) => <button key={`thumb-${moment.image}-${moment.caption}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Tampilkan momen ${index + 1}: ${moment.caption}`} aria-current={index === activeIndex ? "true" : undefined} className={`relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-2xl border-2 bg-white transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:w-36 ${index === activeIndex ? "scale-[1.03] border-teal-600 shadow-[0_8px_24px_rgba(15,118,110,0.18)]" : "border-white opacity-70 shadow-sm hover:opacity-100"}`}><Image src={moment.image} alt="" fill loading="lazy" sizes="144px" className="object-cover" /><span className={`absolute inset-0 transition ${index === activeIndex ? "bg-transparent" : "bg-slate-900/5"}`} /></button>)}</div></div>

    {lightboxOpen && <div role="dialog" aria-modal="true" aria-label="Galeri momen pembelajaran" className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} onTouchStart={(event) => startSwipe(event.touches[0].clientX)} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}><button type="button" onClick={close} aria-label="Tutup galeri" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X aria-hidden="true" /></button><button type="button" onClick={previous} aria-label="Foto sebelumnya" className="absolute left-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"><ChevronLeft aria-hidden="true" /></button><div className="w-full max-w-5xl"><div className="relative aspect-[4/3] max-h-[76vh] overflow-hidden rounded-[24px] bg-slate-900"><Image src={activeMoment.image} alt={activeMoment.alt} fill sizes="100vw" className="object-contain" /></div><p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-white/85">{activeMoment.caption}</p><p className="mt-2 text-center text-xs font-bold tabular-nums text-white/60">{activeIndex + 1} / {moments.length} Momen</p></div><button type="button" onClick={next} aria-label="Foto berikutnya" className="absolute right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"><ChevronRight aria-hidden="true" /></button></div>}
  </section>;
}
