import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-white">

        <Navbar />

        {children}

        <Footer />

      </body>
    </html>
  );
}
