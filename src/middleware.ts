import { decode } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIE_USER_TOKEN_KEY } from './common/constants/cookie';
import {
  ADMINISTRADOR,
  HOME,
  LOGIN,
  REGISTER,
  USER,
  VERIFY_EMAIL,
} from './common/constants/routes';
import type { LoginTokenDto } from './common/validations/auth/login/login-response.dto';
import { roleSchema } from './common/validations/users/user.dto';

const AUTH_PATHS = [LOGIN, REGISTER];
const PUBLIC_PATHS = [VERIFY_EMAIL];

const PREVIOUS_PAGE_SEARCH_PARAM_KEY = 'redirect';

export function middleware(req: NextRequest): NextResponse {
  const userToken = req.cookies.get(COOKIE_USER_TOKEN_KEY);
  const user = userToken ? (decode(userToken.value) as LoginTokenDto) : null;

  if (PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isInAuthPaths = AUTH_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!user) {
    if (!isInAuthPaths) {
      const loginUrl = new URL(LOGIN, req.nextUrl.origin);

      loginUrl.searchParams.set(
        PREVIOUS_PAGE_SEARCH_PARAM_KEY,
        req.nextUrl.pathname,
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const previousPage =
    req.nextUrl.searchParams.get(PREVIOUS_PAGE_SEARCH_PARAM_KEY) ?? HOME;

  const previousPageUrl = new URL(previousPage, req.nextUrl.origin);

  if (user && isInAuthPaths) {
    return NextResponse.redirect(previousPageUrl);
  }

  if (
    req.nextUrl.pathname.startsWith(ADMINISTRADOR) &&
    user.role !== roleSchema.enum.ADMINISTRADOR
  ) {
    return NextResponse.redirect(new URL(previousPage, req.nextUrl.origin));
  }

  // TODO: Remove this when we have a home page
  if (req.nextUrl.pathname === HOME || req.nextUrl.pathname === '/') {
    if (user.role === roleSchema.enum.ADMINISTRADOR) {
      return NextResponse.redirect(new URL(ADMINISTRADOR, req.nextUrl.origin));
    } else {
      return NextResponse.redirect(new URL(USER, req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * https://nextjs.org/docs/app/building-your-application/routing/middleware
   *
   * We need to exclude the following paths otherwise we can end up breaking
   * the css import or other stuff.
   *
   * Match all except specific paths.
   */
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
