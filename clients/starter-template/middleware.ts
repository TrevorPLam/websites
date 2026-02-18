/**
 * @file clients/starter-template/middleware.ts
 * Purpose: next-intl middleware — locale negotiation, redirects (e.g. / → /en).
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
