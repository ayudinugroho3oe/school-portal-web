"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../data/gallery";

const SWIPE_THRESHOLD = 45;

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIndex((current) => current === null ? null : (current + 1) % images.length), [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>("[data-gallery-dialog]");
        const controls = dialog?.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [activeIndex, close, next, previous]);

  const open = (index: number, trigger: HTMLElement) => { returnFocusRef.current = trigger; setActiveIndex(index); };
  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) next();
      else previous();
    }
    touchStartX.current = null;
  };

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image, index) => (
          <button key={image.id} type="button" onClick={(event) => open(index, event.currentTarget)} aria-label={`Buka foto ${index + 1}: ${image.alt}`} className="group relative aspect-[4/3] overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-3">
            <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:480px) 50vw, 100vw" className="object-cover transition duration-500 ease-out motion-reduce:transition-none group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
            {image.caption && <span className="absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 text-left text-sm font-semibold leading-5 text-white opacity-0 transition duration-300 motion-reduce:transition-none group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">{image.caption}</span>}
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div data-gallery-dialog role="dialog" aria-modal="true" aria-label={`Foto ${activeIndex + 1} dari ${images.length}`} className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/92 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}>
          <button ref={closeButtonRef} type="button" onClick={close} aria-label="Tutup galeri" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X aria-hidden="true" /></button>
          <button type="button" onClick={previous} aria-label="Foto sebelumnya" className="absolute left-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"><ChevronLeft aria-hidden="true" /></button>
          <div className="w-full max-w-6xl">
            <div className="relative mx-auto aspect-[4/3] max-h-[78vh] overflow-hidden rounded-[22px] bg-slate-900"><Image src={activeImage.src} alt={activeImage.alt} fill sizes="100vw" className="object-contain" /></div>
            {activeImage.caption && <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-white/85">{activeImage.caption}</p>}
            <p className="mt-2 text-center text-xs font-bold tabular-nums text-white/60">{activeIndex + 1} / {images.length}</p>
          </div>
          <button type="button" onClick={next} aria-label="Foto berikutnya" className="absolute right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"><ChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </>
  );
}
