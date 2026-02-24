/**
 * @file packages/core/shared/Option.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.
 
 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

export type Option<T> = { kind: 'some'; value: T } | { kind: 'none' };

/**
 * export function some<T>(value: T): Option<T>.
 */
export function some<T>(value: T): Option<T> {
  return { kind: 'some', value };
}

/**
 * export function none<T = never>(): Option<T>.
 */
export function none<T = never>(): Option<T> {
  return { kind: 'none' };
}

/**
 * export function mapOption<T, U>(option: Option<T>, mapper: (value: T) => U): Option<U>.
 */
export function mapOption<T, U>(option: Option<T>, mapper: (value: T) => U): Option<U> {
  return option.kind === 'some' ? some(mapper(option.value)) : none();
}

/**
 * export function flatMapOption<T, U>(.
 */
export function flatMapOption<T, U>(option: Option<T>, mapper: (value: T) => Option<U>): Option<U> {
  return option.kind === 'some' ? mapper(option.value) : none();
}

/**
 * export function matchOption<T, R>(.
 */
export function matchOption<T, R>(
  option: Option<T>,
  handlers: { some: (value: T) => R; none: () => R }
): R {
  return option.kind === 'some' ? handlers.some(option.value) : handlers.none();
}
