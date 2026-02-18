// Task: [5.1] Edge: experiments, personalization
import { createMiddleware } from '@repo/infra';

export const middleware = createMiddleware({});
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
