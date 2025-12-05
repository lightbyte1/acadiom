import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, NextRequest } from "next/server";
import {
  onboardingProtectedRoutes,
  authProtectedRoutes,
  nonAuthRoutes,
  matchesRoute,
} from "@/config/routes";
// Middleware uses its own Supabase client, so we query directly here
import { rootDomain } from "./lib/utils";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const subdomain = extractSubdomain(request);
  const { supabase, response } = createClient(request);

  // Run i18n middleware first
  const intlResponse = intlMiddleware(request);
  if (intlResponse?.status === 307) {
    return intlResponse;
  }

  if (subdomain) {
    return NextResponse.rewrite(
      new URL(
        `${pathname.replace(
          /^\/([^/]+)/,
          (_: string, locale: string) => `/${locale}/t/${subdomain}`
        )}`,
        request.url
      )
    );
  }

  // Get user
  const user = (await supabase.auth.getUser()).data.user;

  // Check route types
  const isOnboardingProtected = matchesRoute(
    pathname,
    onboardingProtectedRoutes,
    routing.locales
  );
  const isAuthProtected = matchesRoute(
    pathname,
    authProtectedRoutes,
    routing.locales
  );
  const isNonAuthRoute = matchesRoute(pathname, nonAuthRoutes, routing.locales);

  // Helper to get profile in middleware (uses middleware's supabase client)
  const getProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    return error || !data ? null : data;
  };

  // Non-auth routes: redirect if authenticated
  if (isNonAuthRoute && user) {
    const profile = await getProfile(user.id);
    const redirectUrl = profile?.full_name ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Onboarding-protected routes: require auth + onboarding
  if (isOnboardingProtected) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    const profile = await getProfile(user.id);
    if (!profile?.full_name) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Auth-protected routes: require auth only
  if (isAuthProtected) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    const profile = await getProfile(user.id);
    if (profile?.full_name) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return intlResponse || response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
