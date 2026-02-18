// Task: [5.1] Edge: experiments, personalization
// Use direct path to avoid pulling Node-only modules (logger, etc.) into Edge runtime
import { createMiddleware, getAllowedOriginsFromEnv } from '@repo/infra/middleware/create-middleware';

export const middleware = createMiddleware({
  allowedOrigins: getAllowedOriginsFromEnv(),
});
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
