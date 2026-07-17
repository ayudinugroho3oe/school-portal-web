export default function Loading() {
  return (
    <main className="min-h-[50vh] bg-[linear-gradient(145deg,#EEF6F1,#FFF8EC)] px-6 py-20" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-10 max-w-md animate-pulse rounded-lg bg-emerald-100" />
        <div className="mt-6 h-5 max-w-2xl animate-pulse rounded bg-amber-100" />
        <div className="mt-3 h-5 max-w-xl animate-pulse rounded bg-indigo-100" />
        <span className="sr-only">Memuat halaman...</span>
      </div>
    </main>
  );
}
