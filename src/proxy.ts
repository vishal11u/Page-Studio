import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import { parseRole, hasPermission } from '@/lib/auth/roles';

export default function proxy(request: NextRequest) {
  const role = parseRole(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/studio')) {
    if (!hasPermission(role, 'edit')) {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      url.searchParams.set('from', pathname);
      url.searchParams.set('reason', 'studio');
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/api/publish')) {
    if (!hasPermission(role, 'publish')) {
      return NextResponse.json(
        { error: 'Forbidden: publisher role required' },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/api/publish'],
};
