import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Languages, Shapes } from "lucide-react";
import { programs } from "../data/programs";

const programIcons = [BookOpen, Shapes, Languages, Heart];
const iconStyles = [
  "bg-green-700 text-white",
  "bg-amber-400 text-amber-950",
  "bg-rose-400 text-white",
  "bg-lime-600 text-white",
];

const cardStyles = [
  "hover:border-green-200",
  "hover:border-amber-200",
  "hover:border-rose-200",
  "hover:border-lime-200",
];

function ProgramLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/program"
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-6 py-3 text-sm font-semibold text-green-700 transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 ${className}`}
    >
      Lihat Semua Program <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

export default function Programs() {
  return (
    <section className="bg-[#F8FAFC] py-20 font-sans lg:py-[120px]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Program Unggulan Kami
            </h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-amber-400" />
          </div>
          <ProgramLink className="hidden shrink-0 lg:inline-flex" />
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
          {programs.map((program, index) => {
            const Icon = programIcons[index] ?? BookOpen;
            return (
              <article
                key={program.id}
                className={`group min-w-0 overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_25px_45px_rgba(0,0,0,0.08)] ${cardStyles[index]}`}
              >
                <div className="relative h-20 overflow-hidden sm:h-36 lg:h-40">
                  <Image
                    src={program.image}
                    alt={`Program ${program.title} di TK Islam Ar Rahmah 48`}
                    fill
                    sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 25vw"
                    className="object-cover transition duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent" />
                  <span className={`absolute bottom-1 left-1 inline-flex h-6 w-6 items-center justify-center rounded-lg shadow-md sm:bottom-3 sm:left-4 sm:h-10 sm:w-10 sm:rounded-xl ${iconStyles[index]}`}>
                    <Icon size={14} className="sm:h-5 sm:w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-[9px] font-bold leading-3 text-green-950 sm:text-base sm:leading-5">{program.title}</h3>
                  <p className="mt-2 hidden text-xs leading-5 text-slate-500 sm:block">{program.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 text-center lg:hidden">
          <ProgramLink />
        </div>
      </div>
    </section>
  );
}
