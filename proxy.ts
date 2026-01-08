import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({
              name,
              value,
              ...options,
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isHomePage = request.nextUrl.pathname.startsWith('/home');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isSettingsPage = request.nextUrl.pathname.startsWith('/settings');
  const isRulesPage = request.nextUrl.pathname.startsWith('/rules');
  const isLogsPage = request.nextUrl.pathname.startsWith('/logs');

  const isProtectedRoute =
    isHomePage ||
    isOnboardingPage ||
    isSettingsPage ||
    isRulesPage ||
    isLogsPage;

  if (!user && isProtectedRoute && !isOnboardingPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && (isHomePage || isSettingsPage || isRulesPage || isLogsPage)) {
    // Check if user has a username
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();

    if (!profile?.username) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  if (user && isOnboardingPage) {
    // If they already have a username, don't let them go back to onboarding
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profile?.username) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return response;
}
