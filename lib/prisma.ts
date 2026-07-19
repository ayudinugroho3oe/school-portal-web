import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const fallbackBuildUrl = "postgresql://build:build@127.0.0.1:5432/build";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? fallbackBuildUrl }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
}
