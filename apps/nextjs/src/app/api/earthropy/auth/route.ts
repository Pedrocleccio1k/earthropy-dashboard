import type { NextRequest } from "next/server";

import { auth } from "@homarr/auth/next";

/**
 * EARTHROPY single sign-on.
 *
 * The doorman (Caddy `forward_auth`) asks this route before letting a request into
 * another EARTHROPY app (A Drive, System…). The browser's dashboard session decides:
 *  - signed in  → 200 with X-Earthropy-User / X-Earthropy-Groups, which the doorman
 *                 passes on to the app, so the user never sees a second login;
 *  - signed out → page loads are sent to the dashboard login (and come back after),
 *                 other requests get 401.
 */
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

// HTTP headers only carry plain ASCII; anything else is sent URL-encoded
const headerSafe = (value: string) => (/^[\x20-\x7e]*$/.test(value) ? value : encodeURIComponent(value));

export async function GET(request: NextRequest) {
  const session = await auth();
  const username = session?.user.name;

  if (session && username) {
    return new Response(null, {
      status: 200,
      headers: {
        ...noStore,
        "X-Earthropy-User": headerSafe(username),
        "X-Earthropy-Groups": session.user.permissions.includes("admin") ? "admin" : "users",
      },
    });
  }

  const wantsPage = (request.headers.get("accept") ?? "").includes("text/html");
  if (wantsPage) {
    const original = request.headers.get("x-forwarded-uri") ?? "/";
    const back = original.startsWith("/") && !original.startsWith("//") ? original : "/";
    return new Response(null, {
      status: 302,
      headers: { ...noStore, Location: `/auth/login?callbackUrl=${encodeURIComponent(back)}` },
    });
  }

  return Response.json({ error: "Sign in on the EARTHROPY dashboard first." }, { status: 401, headers: noStore });
}
