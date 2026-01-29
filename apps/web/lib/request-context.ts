export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  return fn()
}

export function getRequestId(): string | undefined {
  return undefined
}
