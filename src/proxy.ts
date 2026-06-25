import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { AdminRole, AdminTokenPayload } from '@/lib/admin-auth-config';
import {
  canAccessAdminPath,
  getDashboardPath,
} from '@/lib/admin-auth-config';

const intlMiddleware = createMiddleware(routing);

const rawSecret = process.env.JWT_SECRET;
if (
  process.env.NODE_ENV === 'production' &&
  (!rawSecret || rawSecret === 'dev_shared_secret_change_in_production')
) {
  // Warn, but DON'T crash the whole site (including public pages) over a
  // secret that only affects the admin area. Admin JWT verification simply
  // fails closed (redirects to login) when the secret doesn't match.
  console.warn(
    'JWT_SECRET is not set to a strong value — admin auth will not work until it is configured to match the backend.'
  );
}
const JWT_SECRET = new TextEncoder().encode(
  rawSecret || 'fallback_secret_for_development'
);

async function getAdminFromToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const isAuthApi =
      pathname.startsWith('/api/admin/auth') ||
      pathname === '/api/admin/login';

    if (isLoginPage || isAuthApi) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const locale = routing.defaultLocale;
      const redirectUrl = new URL(`/${locale}`, request.url);
      redirectUrl.searchParams.set('admin', 'login');
      return NextResponse.redirect(redirectUrl);
    }

    const admin = await getAdminFromToken(token);

    if (!admin?.role) {
      const response = NextResponse.redirect(
        new URL(`/${routing.defaultLocale}`, request.url)
      );
      response.cookies.delete('admin_token');
      return response;
    }

    if (!canAccessAdminPath(admin.role as AdminRole, pathname)) {
      return NextResponse.redirect(
        new URL(getDashboardPath(admin.role as AdminRole), request.url)
      );
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(uz|ru|en)/:path*', '/admin/:path*'],
};
