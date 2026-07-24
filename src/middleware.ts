import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/admin']

// Admin-only routes
const ADMIN_PREFIXES = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (!isProtected) return NextResponse.next()

  // Read auth token from cookie (set on login)
  const token = request.cookies.get('bx_token')?.value
  const role = request.cookies.get('bx_role')?.value

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin route but user is not admin → redirect to dashboard
  const isAdminRoute = ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
