import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/scholarships', '/resources', '/auth/signin', '/auth/signup']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Admin-only routes
  const adminRoutes = [
    '/dashboard/scholarships/new',
    '/dashboard/scholarships/edit',
    '/dashboard/users',
    '/dashboard/resources',
    '/dashboard/moderation'
  ]
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Super admin-only routes
  const superAdminRoutes = ['/dashboard/moderation']
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route))

  // Student-only routes
  const studentRoutes = ['/apply']
  const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route))

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to signin
  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check role-based access
  const userRole = token.role as string

  // Super admin route access check
  if (isSuperAdminRoute && userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Admin route access check
  if (isAdminRoute && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard/student', request.url))
  }

  // Student route access check
  if (isStudentRoute && userRole !== 'STUDENT') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Dashboard route redirection based on role
  if (pathname === '/dashboard') {
    if (userRole === 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url))
    } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
