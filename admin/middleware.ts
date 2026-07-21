import { createServerClient } from '@supabase/ssr'
import { supabasePublishableKey, supabaseUrl } from '@ordi/shared'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase session cookie on every request and bounces anonymous
 * visitors to /login. The *role* check lives in the dashboard layout, where a
 * profiles lookup is cheap and already part of rendering.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = supabaseUrl()
  const key = supabasePublishableKey()
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(toSet) {
        for (const { name, value } of toSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of toSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')

  if (!user && !isLoginRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect_to', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isLoginRoute) {
    const home = request.nextUrl.clone()
    home.pathname = '/'
    home.search = ''
    return NextResponse.redirect(home)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
