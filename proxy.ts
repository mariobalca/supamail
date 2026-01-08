import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

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
    const url = new URL('/login', request.url)
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  if (user && (isHomePage || isSettingsPage || isRulesPage || isLogsPage)) {
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single()

    if (!profile?.username) {
      const url = new URL('/onboarding', request.url)
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }
  }

  if (user && isOnboardingPage) {
    const { data: profile } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single()

    if (profile?.username) {
      const url = new URL('/home', request.url)
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }
  }

  return supabaseResponse;
}
