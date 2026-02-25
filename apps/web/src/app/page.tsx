/**
 * @file apps/web/src/app/page.tsx
 * @summary Home page route.
 * @description Thin wrapper that imports from pages layer.
 * @security No sensitive data exposure; public content only.
 * @adr none
 * @requirements DOMAIN-3-6
 */
import { HomePage } from '@/pages/home';

export default function HomeRoute() {
  return <HomePage />;
}
