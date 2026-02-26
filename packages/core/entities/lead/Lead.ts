/**
 * @file packages/core/entities/lead/Lead.ts
 * @summary Generated for Wave 0 foundational tasks.
 * @exports Public module exports for this file.
 * @invariants Keeps tenant and domain boundaries explicit.
 * @security Internal-only foundation module; avoid exposing tenant internals.
 * @gotchas Intended for server-side and test harness usage in this monorepo.

 * @description Wave 0 foundational implementation for platform baseline.
 * @adr none
 * @requirements TASKS.md Wave 0 Task 2/3/4
 */

import { Email } from '@repo/core';

export type LeadStatus = 'captured' | 'qualified' | 'converted';

export interface LeadProps {
  id: string;
  tenantId: string;
  email: Email;
  name: string;
  status: LeadStatus;
  score?: number;
  assigneeUserId?: string;
}

/**
 * export class Lead.
 */
export class Lead {
  private constructor(private props: LeadProps) {}

  static capture(props: Omit<LeadProps, 'status'>): Lead {
    return new Lead({ ...props, status: 'captured' });
  }

  qualify(qualityScore: number): void {
    if (this.props.status === 'converted') {
      throw new Error('Cannot qualify a converted lead.');
    }
    this.props.status = 'qualified';
    this.props.score = qualityScore;
  }

  assignTo(userId: string): void {
    if (!userId) {
      throw new Error('Assignee userId is required.');
    }

    this.props.assigneeUserId = userId;
  }

  convert(): void {
    if (this.props.status !== 'qualified') {
      throw new Error('Lead must be qualified before conversion.');
    }

    this.props.status = 'converted';
  }

  toJSON(): LeadProps {
    return { ...this.props };
  }
}
