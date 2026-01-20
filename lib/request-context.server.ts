import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  requestId?: string
}

const requestContextStore = new AsyncLocalStorage<RequestContext>()

export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  if (!requestId) {
    return fn()
  }

  return requestContextStore.run({ requestId }, fn)
}

export function getRequestId(): string | undefined {
  return requestContextStore.getStore()?.requestId
}
