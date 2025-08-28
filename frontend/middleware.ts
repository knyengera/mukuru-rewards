import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const token = req.cookies.get('auth_token')?.value || null;

  // Admin routes protection
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      const base64 = (token.split('.')[1] || '');
      // atob is available in edge runtime
      const json = atob(base64);
      const payload = JSON.parse(json) as any;
      const isAdmin = payload?.role === 'admin' || payload?.scope === 'admin';
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/not-authorised', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // User-protected routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};


