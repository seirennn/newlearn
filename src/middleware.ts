import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const isAppSubdomain = hostname?.startsWith('app.')

  if (isAppSubdomain) {
    const url = request.nextUrl.clone()
    
    // Handle root path
    if (url.pathname === '/') {
      url.pathname = '/(dashboard)'
      return NextResponse.rewrite(url)
    }
    
    // Handle all other paths
    if (!url.pathname.startsWith('/(dashboard)')) {
      url.pathname = `/(dashboard)${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

// Configure middleware matching
export const config = {
  matcher: [
    // Match all paths except Next.js static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',  // Also match the root path
  ],
}
