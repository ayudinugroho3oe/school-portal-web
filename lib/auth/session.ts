import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";
import { roles, type Actor, type AppRole } from "@/lib/auth/permissions";

export async function getCurrentActor(): Promise<Actor | null> {
  const requestHeaders = await headers();
  if (!getSessionCookie(requestHeaders)) return null;
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return null;
  const role = String(session.user.role) as AppRole;
  return { id: session.user.id, role: roles.includes(role) ? role : "TEACHER" };
}
