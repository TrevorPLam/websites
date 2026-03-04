/**
 * @file packages/services/src/tests/contracts/contract-runner.ts
 * @summary Unified contract runner that re-exports all port contract suites.
 * @description Provides a single import surface for CI tooling or root-level
 *   test scripts that need to run every port contract in sequence.
 *
 *   Each contract suite (`runEmailPortContract`, `runCrmPortContract`) follows
 *   the consumer-driven contract pattern: the shared specification lives here
 *   and each adapter must satisfy it independently.
 *
 * @example
 * ```ts
 * // In an adapter test file:
 * import { runEmailPortContract } from '@repo/services/tests/contracts/contract-runner';
 * import { NativeAdapter } from '../native.adapter';
 *
 * runEmailPortContract(() => new NativeAdapter({ dryRun: true }));
 * ```
 * @security Test-only utilities; no production credentials or secrets involved.
 * @adr none
 * @requirements TASK-SVC-002-REV
 */

export { runEmailPortContract, buildSendRequest } from './email-service.contract';

export {
  runCrmPortContract,
  buildCreateRequest as buildCrmCreateRequest,
} from './crm-service.contract';
