export default function Loading() {
  return (
    <main className="min-h-[50vh] bg-white px-6 py-20" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-10 max-w-md rounded-lg bg-green-100" />
        <div className="mt-6 h-5 max-w-2xl rounded bg-gray-100" />
        <div className="mt-3 h-5 max-w-xl rounded bg-gray-100" />
        <span className="sr-only">Memuat halaman...</span>
      </div>
    </main>
  );
}
