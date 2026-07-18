"use client";

import { BookOpen, School, UserRound, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Tahun Berdiri", description: "Konsisten memberikan pendidikan Islam yang berkualitas.", icon: School },
  { value: 250, suffix: "+", label: "Peserta Didik", description: "Tumbuh menjadi anak yang mandiri dan berakhlak mulia.", icon: Users },
  { value: 20, suffix: "+", label: "Guru & Staf", description: "Tenaga pendidik profesional dan berpengalaman.", icon: UserRound },
  { value: 100, suffix: "%", label: "Pembelajaran Islami", description: "Mengintegrasikan nilai Al-Qur’an dalam kegiatan belajar.", icon: BookOpen },
];

const statStyles = [
  "bg-[#EEF6F1] text-green-700",
  "bg-[#FFF8EC] text-amber-700",
  "bg-[#FFF1ED] text-rose-600",
  "bg-[#F3F2F8] text-indigo-600",
];

const iconHoverStyles = [
  "group-hover:bg-emerald-100 group-hover:shadow-[0_8px_24px_rgba(22,163,74,0.18)]",
  "group-hover:bg-amber-100 group-hover:shadow-[0_8px_24px_rgba(217,119,6,0.18)]",
  "group-hover:bg-rose-100 group-hover:shadow-[0_8px_24px_rgba(225,29,72,0.16)]",
  "group-hover:bg-indigo-100 group-hover:shadow-[0_8px_24px_rgba(79,70,229,0.16)]",
];

export default function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = stats.map((stat) => stat.value);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = window.requestAnimationFrame(() => setValues(targets));
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let animationFrame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 1300;
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValues(targets.map((target) => Math.round(target * eased)));
        if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
      };
      animationFrame = window.requestAnimationFrame(animate);
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Statistik sekolah" className="bg-transparent pb-16 pt-4 font-sans lg:pb-20">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-7">
        <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_18px_46px_rgba(15,118,110,0.10)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`group relative z-0 flex min-w-0 items-center gap-3 px-3 py-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-[transform,background-color,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1.5 hover:bg-green-50/45 hover:shadow-[0_14px_32px_rgba(15,118,110,0.10)] sm:px-5 lg:px-6 ${
                    index % 2 ? "border-l border-slate-100" : ""
                  } ${index > 1 ? "border-t border-slate-100 lg:border-t-0" : ""} ${
                    index > 0 ? "lg:border-l lg:border-slate-100" : ""
                  }`}
                >
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] transition-[transform,background-color,box-shadow] duration-300 ease-out group-hover:scale-[1.06] sm:h-14 sm:w-14 ${statStyles[index]} ${iconHoverStyles[index]}`}>
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-xl font-extrabold tracking-tight text-green-700 tabular-nums sm:text-2xl">{values[index]}{stat.suffix}</strong>
                    <span className="block text-[10px] font-bold leading-4 text-slate-800 sm:text-xs">{stat.label}</span>
                    <span className="mt-1 hidden max-w-[170px] text-[10px] leading-4 text-slate-500 xl:block">{stat.description}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
