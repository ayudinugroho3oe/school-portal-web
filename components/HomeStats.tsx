import { BookOpen, School, UserRound, Users } from "lucide-react";

const stats = [
  { value: "15+", label: "Tahun Berdiri", description: "Konsisten memberikan pendidikan Islam yang berkualitas.", icon: School },
  { value: "250+", label: "Peserta Didik", description: "Tumbuh menjadi anak yang mandiri dan berakhlak mulia.", icon: Users },
  { value: "20+", label: "Guru & Staf", description: "Tenaga pendidik profesional dan berpengalaman.", icon: UserRound },
  { value: "100%", label: "Pembelajaran Islami", description: "Mengintegrasikan nilai Al-Qur’an dalam kegiatan belajar.", icon: BookOpen },
];

const statStyles = [
  "bg-[#EEF6F1] text-green-700",
  "bg-[#FFF8EC] text-amber-700",
  "bg-[#FFF1ED] text-rose-600",
  "bg-[#F3F2F8] text-indigo-600",
];

export default function HomeStats() {
  return (
    <section aria-label="Statistik sekolah" className="bg-transparent pb-16 pt-4 font-sans lg:pb-20">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-7">
        <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_18px_46px_rgba(15,118,110,0.10)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`group flex min-w-0 items-center gap-3 px-3 py-5 transition duration-300 ease-out hover:-translate-y-1 hover:bg-green-50/45 sm:px-5 lg:px-6 ${
                    index % 2 ? "border-l border-slate-100" : ""
                  } ${index > 1 ? "border-t border-slate-100 lg:border-t-0" : ""} ${
                    index > 0 ? "lg:border-l lg:border-slate-100" : ""
                  }`}
                >
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] sm:h-14 sm:w-14 ${statStyles[index]}`}>
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-xl font-extrabold tracking-tight text-green-700 sm:text-2xl">{stat.value}</strong>
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
