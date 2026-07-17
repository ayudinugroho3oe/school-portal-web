import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center bg-green-50 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-semibold uppercase tracking-[0.2em] text-green-700">404</p>
        <h1 className="mt-4 text-4xl font-bold text-green-900 md:text-5xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-5 text-gray-600">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-green-700 px-8 py-4 font-semibold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
