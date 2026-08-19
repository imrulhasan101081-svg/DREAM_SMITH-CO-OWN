import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const secret = process.env.NEXTAUTH_SECRET;

// Preserve the current request's locale prefix (e.g. /bn/...) when building
// a redirect URL, instead of always emitting an unprefixed (English) path.
function localizedUrl(path: string, req: NextRequest): URL {
  const segments = req.nextUrl.pathname.split("/");
  const maybeLocale = segments[1];
  const locale = routing.locales.includes(maybeLocale as any)
    ? maybeLocale
    : routing.defaultLocale;
  return new URL(`/${locale}${path}`, req.url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Route Guards ──────────────────────────────────────────────────────────

  // Admin protected routes — require SUPER_ADMIN or REGULAR_ADMIN role
  const isAdminProtected =
    pathname.includes("/admin") &&
    !pathname.includes("/admin/login") &&
    !pathname.includes("/admin/unauthorized") &&
    !pathname.includes("/api/");

  // Investor portal routes — require investor role
  const isPortalProtected =
    pathname.includes("/portal") && !pathname.includes("/api/");

  if (isAdminProtected) {
    const token = await getToken({ req, secret });

    if (!token) {
      const loginUrl = localizedUrl("/admin/login", req);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;
    if (role !== "SUPER_ADMIN" && role !== "REGULAR_ADMIN") {
      return NextResponse.redirect(localizedUrl("/admin/unauthorized", req));
    }

    // Continue with intl middleware for locale handling
    return intlMiddleware(req);
  }

  if (isPortalProtected) {
    const token = await getToken({ req, secret });

    if (!token) {
      const loginUrl = localizedUrl("/login", req);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;
    if (role !== "investor" && role !== "CLIENT" && role !== "SHAREHOLDER") {
      return NextResponse.redirect(localizedUrl("/login", req));
    }

    return intlMiddleware(req);
  }

  // All other routes — just i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all except api, _next static, and file extensions
    "/((?!api|_next|.*\\..*).*)",
  ],
};
