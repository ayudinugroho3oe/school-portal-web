import { connection } from "next/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type PublicSchoolContent = { schoolName: string; tagline: string; motto: string; logoUrl: string; heroImageUrl: string; buildingImageUrl: string; email: string; whatsapp: string | null; whatsappDisplay: string; operatingHours: string; address: string; history: string | null; vision: string | null; mission: string | null; principalName: string | null; principalPhotoUrl: string | null; principalWelcome: string | null };
const fallback: PublicSchoolContent = { schoolName: "TK Islam Ar Rahmah 48", tagline: "Mendidik Generasi Qurani", motto: "Membangun Generasi Qurani yang Ceria, Mandiri, dan Berkarakter.", logoUrl: "/logo.png", heroImageUrl: "/sekolah.jpg", buildingImageUrl: "/sekolah.jpg", email: "info@arrahmah48.sch.id", whatsapp: null, whatsappDisplay: "08xx-xxxx-xxxx", operatingHours: "Senin - Jumat\n07.30 - 15.00 WIB", address: "Jl. SMA 48 13/01 No. 49, Pinang Ranti", history: null, vision: null, mission: null, principalName: null, principalPhotoUrl: null, principalWelcome: null };

export const getPublicSchoolContent = cache(async (): Promise<PublicSchoolContent> => {
  await connection();
  try {
    if (!process.env.DATABASE_URL) return fallback;
    const value = await prisma.schoolSettings.findFirst({ where: { key: "PRIMARY_SCHOOL", isActive: true } });
    if (!value) return fallback;
    const hours = typeof value.operatingHours === "object" && value.operatingHours && !Array.isArray(value.operatingHours) ? value.operatingHours as Record<string, unknown> : null;
    return { schoolName: value.schoolName || fallback.schoolName, tagline: value.shortName || fallback.tagline, motto: value.schoolMotto || fallback.motto, logoUrl: value.logoUrl || fallback.logoUrl, heroImageUrl: value.heroImageUrl || fallback.heroImageUrl, buildingImageUrl: value.buildingImageUrl || fallback.buildingImageUrl, email: value.email || fallback.email, whatsapp: value.whatsapp, whatsappDisplay: value.whatsapp || fallback.whatsappDisplay, operatingHours: typeof hours?.display === "string" ? hours.display : fallback.operatingHours, address: value.addressLine || fallback.address, history: value.history, vision: value.vision, mission: value.mission, principalName: value.principalName, principalPhotoUrl: value.principalPhotoUrl, principalWelcome: value.principalWelcome };
  } catch { return fallback; }
});
