/**
 * @file packages/features/src/booking/lib/__tests__/booking-repository.test.ts
 * Purpose: Unit tests for BookingRepository interface and InMemoryBookingRepository (Task 0-2).
 */

import { InMemoryBookingRepository } from '../booking-repository';
import type { BookingFormData } from '../booking-schema';

const makeData = (overrides: Partial<BookingFormData> = {}): BookingFormData => ({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '555-123-4567',
  serviceType: 'consultation',
  preferredDate: '2026-06-01',
  timeSlot: '09:00',
  notes: '',
  ...overrides,
});

describe('InMemoryBookingRepository', () => {
  let repo: InMemoryBookingRepository;

  beforeEach(() => {
    repo = new InMemoryBookingRepository();
  });

  describe('create', () => {
    it('creates a record with generated id and timestamp', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-001',
      });
      expect(record.id).toBeDefined();
      expect(record.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(record.timestamp).toBeInstanceOf(Date);
      expect(record.status).toBe('pending');
      expect(record.confirmationNumber).toBe('BK-001');
    });

    it('increments store size on each create', async () => {
      await repo.create({ data: makeData(), status: 'pending', confirmationNumber: 'BK-001' });
      await repo.create({ data: makeData(), status: 'pending', confirmationNumber: 'BK-002' });
      expect(repo.size).toBe(2);
    });
  });

  describe('getById', () => {
    it('returns null for unknown id', async () => {
      expect(await repo.getById('unknown')).toBeNull();
    });

    it('returns the record by id', async () => {
      const created = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-A',
      });
      const found = await repo.getById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('returns null when tenantId does not match', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-T',
        tenantId: 'tenant-a',
      });
      expect(await repo.getById(record.id, 'tenant-b')).toBeNull();
    });

    it('returns record when tenantId matches', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-T',
        tenantId: 'tenant-a',
      });
      const found = await repo.getById(record.id, 'tenant-a');
      expect(found).not.toBeNull();
    });

    it('returns record when tenantId is not specified (no scoping)', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-T',
        tenantId: 'tenant-a',
      });
      expect(await repo.getById(record.id)).not.toBeNull();
    });
  });

  describe('getByConfirmation', () => {
    it('returns null for unknown confirmation number', async () => {
      expect(await repo.getByConfirmation('UNKNOWN', 'jane@example.com')).toBeNull();
    });

    it('returns null for correct confirmation but wrong email', async () => {
      await repo.create({
        data: makeData({ email: 'jane@example.com' }),
        status: 'pending',
        confirmationNumber: 'BK-C1',
      });
      expect(await repo.getByConfirmation('BK-C1', 'wrong@example.com')).toBeNull();
    });

    it('returns the record when confirmation number and email match', async () => {
      await repo.create({
        data: makeData({ email: 'jane@example.com' }),
        status: 'pending',
        confirmationNumber: 'BK-C1',
      });
      const found = await repo.getByConfirmation('BK-C1', 'jane@example.com');
      expect(found).not.toBeNull();
      expect(found?.confirmationNumber).toBe('BK-C1');
    });

    it('enforces tenantId when provided', async () => {
      await repo.create({
        data: makeData({ email: 'jane@example.com' }),
        status: 'pending',
        confirmationNumber: 'BK-C2',
        tenantId: 'tenant-a',
      });
      expect(await repo.getByConfirmation('BK-C2', 'jane@example.com', 'tenant-b')).toBeNull();
      expect(await repo.getByConfirmation('BK-C2', 'jane@example.com', 'tenant-a')).not.toBeNull();
    });
  });

  describe('update', () => {
    it('updates the status of an existing record', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-U1',
      });
      const updated = await repo.update(record.id, { status: 'confirmed' });
      expect(updated.status).toBe('confirmed');
    });

    it('preserves other fields on update', async () => {
      const record = await repo.create({
        data: makeData({ email: 'test@test.com' }),
        status: 'pending',
        confirmationNumber: 'BK-U2',
      });
      const updated = await repo.update(record.id, { status: 'confirmed' });
      expect(updated.data.email).toBe('test@test.com');
      expect(updated.confirmationNumber).toBe('BK-U2');
    });

    it('throws for unknown id', async () => {
      await expect(repo.update('nonexistent', { status: 'confirmed' })).rejects.toThrow(
        'Booking not found'
      );
    });

    it('throws when tenantId does not match', async () => {
      const record = await repo.create({
        data: makeData(),
        status: 'pending',
        confirmationNumber: 'BK-U3',
        tenantId: 'tenant-a',
      });
      await expect(repo.update(record.id, { status: 'confirmed' }, 'tenant-b')).rejects.toThrow(
        'Booking not found'
      );
    });
  });
});
