import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "default_secret_for_local_dev" })
  const { pathname } = request.nextUrl

  // Define protected routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/my-courses')
  const isLearnRoute = pathname.startsWith('/learn') || pathname.startsWith('/certificates')
  const isAdminRoute = pathname.startsWith('/admin')

  // If trying to access login/register while logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected routes without being logged in
  if (!token && (isDashboardRoute || isLearnRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url))
  }

  // Role-based protection for admin routes
  if (isAdminRoute && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
