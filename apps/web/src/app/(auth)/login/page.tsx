/**
 * @file apps/web/src/app/(auth)/login/page.tsx
 * @summary Login page for tenant authentication.
 * @description Provides secure login form with tenant-aware authentication.
 * @security Implements CSRF protection and secure form handling.
 * @adr none
 * @requirements DOMAIN-7-1
 */
'use client';

import { useState } from 'react';
import { LoginPage } from '@/pages/login';

export default function LoginRoute() {
  return <LoginPage />;
}
