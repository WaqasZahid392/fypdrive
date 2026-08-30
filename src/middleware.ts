import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('auth_session')?.value
  const { pathname } = request.nextUrl

  if (!session && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && (pathname === '/' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
