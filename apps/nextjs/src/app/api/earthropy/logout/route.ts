import { cookies } from "next/headers";

import { sessionTokenCookieName } from "@homarr/auth";
import { db, eq } from "@homarr/db";
import { sessions } from "@homarr/db/schema";

/**
 * EARTHROPY single sign-on: signing out from any app (e.g. the A Drive "Logout" button)
 * ends the dashboard session, which signs the user out of every EARTHROPY app at once.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const names = [sessionTokenCookieName, `__Secure-${sessionTokenCookieName}`];

  for (const name of names) {
    const token = store.get(name)?.value;
    if (token) {
      await db.delete(sessions).where(eq(sessions.sessionToken, token));
    }
    store.delete(name);
  }

  return new Response(null, {
    status: 302,
    headers: { "Cache-Control": "no-store", Location: "/auth/login" },
  });
}
