import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "Kontak dan PPDB",
  description: "Hubungi TK Islam Ar Rahmah 48 untuk informasi sekolah, program, dan penerimaan peserta didik baru.",
};

export default function KontakPage() {
  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-700 md:text-4xl">
            Hubungi Kami
          </h1>

          <p className="mt-4 text-gray-600">
            Kami siap membantu Anda mendapatkan informasi mengenai
            TK Islam Ar Rahmah 48.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              Informasi Sekolah
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <strong>✉️ Email:</strong><br />
                <a
                  href="mailto:info@arrahmah48.sch.id"
                  className="break-all text-green-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
                >
                  info@arrahmah48.sch.id
                </a>
              </p>

              <p>
                <strong>🕒 Jam Operasional:</strong><br />
                Senin - Jumat<br />
                07.00 - 16.00 WIB
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              Kirim Pesan
            </h2>

            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}
