import { createMiddleware } from '@repo/infra';

export const middleware = createMiddleware({});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|apple-touch-icon.png).*)',
  ],
};
