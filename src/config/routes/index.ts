// SaaS-specific route protection configuration
// Routes that require authentication AND onboarding completion (full_name)
// User must be authenticated and have completed onboarding
export const onboardingProtectedRoutes = ["/dashboard"];

// Routes that require authentication only (no full_name needed)
// User just needs to be logged in, even if onboarding is incomplete
export const authProtectedRoutes = ["/onboarding"];

// Routes that should NOT be accessible when authenticated
// Redirect authenticated users away from these routes
export const nonAuthRoutes = ["/sign-in", "/sign-up"];

// Helper function to check if pathname matches any route pattern
export function matchesRoute(
  pathname: string,
  routes: string[],
  locales: readonly string[]
): boolean {
  return routes.some((route) => {
    const exactMatch = pathname === route;
    const startsWithMatch = pathname.startsWith(route + "/");
    const localeMatch = locales.some(
      (locale) =>
        pathname === `/${locale}${route}` ||
        pathname.startsWith(`/${locale}${route}/`)
    );
    return exactMatch || startsWithMatch || localeMatch;
  });
}
