/**
 * @file packages/core/shared/Result.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * export function ok<T>(value: T): Result<T, never>.
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * export function err<E>(error: E): Result<never, E>.
 */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * export function map<T, E, U>(result: Result<T, E>, mapper: (value: T) => U): Result<U, E>.
 */
export function map<T, E, U>(result: Result<T, E>, mapper: (value: T) => U): Result<U, E> {
  return result.ok ? ok(mapper(result.value)) : result;
}

/**
 * export function flatMap<T, E, U, F>(.
 */
export function flatMap<T, E, U, F>(
  result: Result<T, E>,
  mapper: (value: T) => Result<U, F>
): Result<U, E | F> {
  return result.ok ? mapper(result.value) : result;
}

/**
 * export function match<T, E, R>(.
 */
export function match<T, E, R>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => R; err: (error: E) => R }
): R {
  return result.ok ? handlers.ok(result.value) : handlers.err(result.error);
}
