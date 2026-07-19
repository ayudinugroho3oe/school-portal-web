import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { getPublicSchoolContent } from "@/lib/public-school-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TK Islam Ar Rahmah 48",
    template: "%s | TK Islam Ar Rahmah 48",
  },
  description: "Website resmi TK Islam Ar Rahmah 48, sekolah Islam dengan pembelajaran aktif dan lingkungan ramah anak.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "TK Islam Ar Rahmah 48",
    title: "TK Islam Ar Rahmah 48",
    description: "Sekolah Islam dengan pembelajaran aktif dan lingkungan ramah anak.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicContent = await getPublicSchoolContent();
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800">

        <Navbar content={publicContent} />

        {children}

        <Footer content={publicContent} />

        <FloatingWhatsApp whatsapp={publicContent.whatsapp} />

      </body>
    </html>
  );
}
