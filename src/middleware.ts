import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth is handled inside the Server Component via cookies()
// Middleware is kept minimal to avoid Edge runtime cookie timing issues
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
