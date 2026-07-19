"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const fallbackHeroImages = [
  { src: "/sekolah.jpg", alt: "Kegiatan bermain sambil belajar di TK Islam Ar Rahmah 48", position: "center" },
  { src: "/sekolah2.png", alt: "Kegiatan peserta didik TK Islam Ar Rahmah 48", position: "center" },
  { src: "/sekolah3.png", alt: "Suasana belajar di TK Islam Ar Rahmah 48", position: "center" },
] as const;

const AUTO_SLIDE_DELAY = 5000;
const SWIPE_THRESHOLD = 45;

export default function HeroCarousel({ primaryImage, schoolName }: { primaryImage?: string; schoolName?: string }) {
  const heroImages = [{ ...fallbackHeroImages[0], src: primaryImage || fallbackHeroImages[0].src, alt: `Kegiatan belajar di ${schoolName || "TK Islam Ar Rahmah 48"}` }, ...fallbackHeroImages.slice(1)];
  const imageCount = heroImages.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageCount);
    }, AUTO_SLIDE_DELAY);
    return () => window.clearInterval(timer);
  }, [paused, imageCount]);

  const finishSwipe = (clientX: number) => {
    if (touchStartX.current === null) return;
    const distance = clientX - touchStartX.current;
    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      setActiveIndex((current) => distance < 0 ? (current + 1) % heroImages.length : (current - 1 + heroImages.length) % heroImages.length);
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Foto kegiatan sekolah"
      className="group relative h-[245px] touch-pan-y overflow-hidden rounded-[30%_14%_28%_16%/18%_15%_25%_22%] ring-[6px] ring-white/80 shadow-[0_32px_80px_rgba(15,118,110,0.20),0_8px_24px_rgba(15,23,42,0.10)] sm:h-[360px] md:h-[405px] lg:h-[420px] xl:h-[435px]"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}
      onTouchCancel={() => { touchStartX.current = null; setPaused(false); }}
    >
      {heroImages.map((image, index) => (
        <div
          key={`${image.src}-${image.position}`}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out motion-reduce:transition-none ${index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"}`}
        >
          <Image
            src={image.src}
            alt={index === activeIndex ? image.alt : ""}
            fill
            preload={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-[1.018]"
            style={{ objectPosition: image.position }}
            unoptimized={image.src.startsWith("http")}
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,transparent_38%,rgba(15,23,42,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-x-[12%] top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center gap-2" role="group" aria-label="Pilih foto hero">
        {heroImages.map((image, index) => (
          <button
            key={`dot-${image.src}-${image.position}`}
            type="button"
            aria-label={`Tampilkan foto ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full border border-white/80 shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700 ${index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"}`}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Foto {activeIndex + 1} dari {heroImages.length}</p>
    </div>
  );
}
