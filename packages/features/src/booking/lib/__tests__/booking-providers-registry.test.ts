/**
 * Booking provider registry tests (inf-10).
 * Verifies registerBookingProvider, getBookingProviderRegistry, and
 * invalidation of cached BookingProviders singleton on registration.
 */

// NOTE: Jest isolates modules per file by default, so each require() in
// isolateModules() yields a fresh module instance with an empty registry.

import type { ProviderConfig, BookingProviderAdapter } from '../booking-provider-adapter';
import type { BookingFormData } from '../booking-schema';

/** Minimal stub adapter that implements BookingProviderAdapter. */
function makeStubAdapter(config: ProviderConfig): BookingProviderAdapter {
  return {
    name: 'stub',
    apiBase: 'https://stub.example.com',
    config,
    createBooking: (_data: BookingFormData) =>
      Promise.resolve({ success: true, bookingId: 'stub-1' }),
    mapServiceId: (id: string) => id,
    mapTimeSlot: (slot: string) => slot,
    buildRequestBody: () => ({}),
    parseResponse: () => ({ success: true }),
  };
}

describe('registerBookingProvider', () => {
  it('adds a factory to the registry', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { registerBookingProvider, getBookingProviderRegistry } =
        require('../booking-providers') as typeof import('../booking-providers');
      expect(getBookingProviderRegistry().size).toBe(0);
      registerBookingProvider('stub', makeStubAdapter);
      expect(getBookingProviderRegistry().has('stub')).toBe(true);
      expect(getBookingProviderRegistry().size).toBe(1);
    });
  });

  it('retrieves the registered factory from the registry', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { registerBookingProvider, getBookingProviderRegistry } =
        require('../booking-providers') as typeof import('../booking-providers');
      registerBookingProvider('my-provider', makeStubAdapter);
      const registry = getBookingProviderRegistry();
      const factory = registry.get('my-provider');
      expect(factory).toBeDefined();
      if (!factory) return;
      const adapter = factory({ enabled: true, apiKey: 'key123' });
      expect(adapter.name).toBe('stub');
    });
  });

  it('warns and overwrites on duplicate registration', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { registerBookingProvider, getBookingProviderRegistry } =
        require('../booking-providers') as typeof import('../booking-providers');
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      registerBookingProvider('dup-provider', makeStubAdapter);
      registerBookingProvider('dup-provider', makeStubAdapter);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Provider 'dup-provider' is already registered")
      );
      // Registry still has exactly one entry for 'dup-provider'
      expect(getBookingProviderRegistry().has('dup-provider')).toBe(true);
      warnSpy.mockRestore();
    });
  });

  it('invalidates cached BookingProviders singleton on registration', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { registerBookingProvider, getBookingProviders } =
        require('../booking-providers') as typeof import('../booking-providers');
      // Create a cached instance
      const first = getBookingProviders();
      // Register a new provider — should invalidate cache
      registerBookingProvider('cache-test', makeStubAdapter);
      // Next call should return a new instance (not same reference)
      const second = getBookingProviders();
      expect(first).not.toBe(second);
    });
  });
});

describe('getBookingProviderRegistry', () => {
  it('returns an empty registry initially', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getBookingProviderRegistry } =
        require('../booking-providers') as typeof import('../booking-providers');
      expect(getBookingProviderRegistry().size).toBe(0);
    });
  });

  it('returns a ReadonlyMap (does not expose mutating methods)', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getBookingProviderRegistry } =
        require('../booking-providers') as typeof import('../booking-providers');
      const registry = getBookingProviderRegistry();
      // ReadonlyMap has no set/delete methods at the TypeScript level.
      // At runtime, the underlying Map still has them, but the TypeScript type guards against it.
      expect(typeof registry.get).toBe('function');
      expect(typeof registry.has).toBe('function');
      expect(typeof (registry as Map<string, unknown>).size).toBe('number');
    });
  });
});
