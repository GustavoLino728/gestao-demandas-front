import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth

  const isLoggedIn     = !!session
  const isLoginPage    = nextUrl.pathname.startsWith('/login')
  const isRegisterPage = nextUrl.pathname.startsWith('/register')

  if (isLoggedIn && session?.error === 'RefreshTokenError') {
    const url = new URL('/login', nextUrl.origin)
    url.searchParams.set('error', 'SessionExpired')
    return NextResponse.redirect(url)
  }

  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    const url = new URL('/login', nextUrl.origin)
    url.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/boards', nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|login|register).*)',
  ],
}