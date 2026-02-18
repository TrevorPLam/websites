/**
 * @file clients/starter-template/i18n/navigation.ts
 * Purpose: Locale-aware Link, useRouter, usePathname for next-intl.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
