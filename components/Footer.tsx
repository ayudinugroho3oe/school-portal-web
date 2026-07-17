import Image from "next/image";
import Link from "next/link";

const footerMenus = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Program", href: "/program" },
  { name: "Galeri", href: "/galeri" },
  { name: "Guru", href: "/guru" },
  { name: "Kontak & PPDB", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>

            <Image
              src="/logo.png"
              alt="Logo"
              width={96}
              height={96}
              className="w-24"
            />

            <h2 className="mt-5 text-2xl font-bold">
              TK Islam Ar Rahmah 48
            </h2>

            <p className="mt-4 text-green-100 leading-7">
              Membangun Generasi Qurani yang Ceria,
              Mandiri,
              dan Berkarakter.
            </p>

          </div>

          <div>

            <h3 className="text-xl font-bold">
              Menu
            </h3>

            <ul className="mt-5 space-y-3 text-green-100">

              {footerMenus.map((menu) => (
                <li key={menu.href}>
                  <Link
                    href={menu.href}
                    className="rounded-sm transition hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}

            </ul>

          </div>

          <div>

            <h3 className="text-xl font-bold">
              Kontak
            </h3>

            <ul className="mt-5 space-y-3 text-green-100">

              <li>
                <a
                  href="mailto:info@arrahmah48.sch.id"
                  className="break-all rounded-sm transition hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  ✉ info@arrahmah48.sch.id
                </a>
              </li>

            </ul>

          </div>

          <div>

            <h3 className="text-xl font-bold">
              Jam Operasional
            </h3>

            <ul className="mt-5 space-y-3 text-green-100">

              <li>Senin - Jumat</li>

              <li>07.30 - 15.00 WIB</li>

            </ul>

          </div>

        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-200">

          © 2026 TK Islam Ar Rahmah 48.
          All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}
