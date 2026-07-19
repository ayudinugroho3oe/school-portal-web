import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { DomainError } from "@/modules/school-settings/domain/errors";

export const requestId = (request: Request) => request.headers.get("x-request-id") ?? crypto.randomUUID();
export const ok = (data: unknown, id: string, status = 200) => NextResponse.json({ data, meta: { requestId: id } }, { status });

export function apiError(error: unknown, id: string) {
  if (error instanceof DomainError) return NextResponse.json({ error: { code: error.code, message: error.message, details: error.details }, meta: { requestId: id } }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed.", details: error.flatten() }, meta: { requestId: id } }, { status: 422 });
  if (error instanceof SyntaxError) return NextResponse.json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON." }, meta: { requestId: id } }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError) console.error(`[${id}] Prisma error ${error.code}`);
  else console.error(`[${id}]`, error);
  return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." }, meta: { requestId: id } }, { status: 500 });
}
