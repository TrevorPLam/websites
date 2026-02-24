/**
 * @file packages/core/value-objects/Email.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { err, ok, type Result } from '../shared/Result';

/**
 * export class Email.
 */
export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<Email, Error> {
    const normalized = value.trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      return err(new Error('Email must be a valid RFC 5322 compatible address.'));
    }

    return ok(new Email(normalized));
  }
}
