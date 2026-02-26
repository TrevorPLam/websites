/**
 * @file admin/src/shared/lib/cn.ts
 * @summary Shared utilities and components.
 * @description Reusable functionality across admin application.
 * @security none
 * @requirements none
 */
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
