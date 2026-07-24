import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/admin']

// Admin-only routes
const ADMIN_PREFIXES = ['/admin']

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bexaltec-dev-secret-change-in-production-min-32-chars'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('bx_token')?.value

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Cryptographically verify the JWT — never trust unsigned cookies for role
  let role: string
  try {
    const { payload } = await jwtVerify(token, SECRET)
    role = payload.role as string
    if (!role) throw new Error('no role in token')
  } catch {
    // Token invalid or tampered — clear cookies and redirect
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('bx_token')
    response.cookies.delete('bx_role')
    return response
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
