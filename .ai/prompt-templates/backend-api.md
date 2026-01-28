# Backend API Template

When creating a new API route in Next.js:

1. **Create route**: `app/api/[route]/route.ts`
2. **Use Server Actions**: For form submissions, prefer `lib/actions/`
3. **API Routes**: For external integrations or webhooks
4. **Validation**: Use `lib/request-validation.ts` utilities
