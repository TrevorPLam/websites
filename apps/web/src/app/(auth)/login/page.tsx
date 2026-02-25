/**
 * @file apps/web/src/app/(auth)/login/page.tsx
 * @summary Login page for authentication.
 * @description Thin wrapper that imports from pages layer.
 */

import { LoginPage } from '@/pages/login'

export default function LoginRoute() {
  return <LoginPage />
}
