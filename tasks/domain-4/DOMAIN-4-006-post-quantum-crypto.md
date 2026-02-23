---
# ─────────────────────────────────────────────────────────────
# TASK METADATA  (YAML frontmatter — machine + human readable)
# ─────────────────────────────────────────────────────────────
id: DOMAIN-4-006
title: 'Post-quantum cryptography abstraction layer'
status: done # pending | in-progress | blocked | review | done
priority: low # critical | high | medium | low
type: feature # feature | fix | refactor | test | docs | chore
created: 2026-02-23
updated: 2026-02-23
owner: '' # agent or human responsible
branch: feat/DOMAIN-4-006-post-quantum-crypto
allowed-tools: Bash(git:*) Read Write Bash(pnpm:*) Bash(node:*)
---

# DOMAIN-4-006 · Post-quantum cryptography abstraction layer

## Objective

Implement post-quantum cryptography abstraction layer following section 4.7 specification with NIST FIPS 203/204/205 compliance, supporting RSA → Hybrid → ML-DSA migration phases while maintaining backward compatibility.

---

## Context

**Documentation Reference:**

- Security Middleware Implementation: `docs/guides/security/security-middleware-implementation.md` ✅ COMPLETED
- Server Action Security Wrapper: `docs/guides/security/server-action-security-wrapper.md` ✅ COMPLETED
- Security Headers System: `docs/guides/security/security-headers-system.md` ✅ COMPLETED
- Multi Layer Rate Limiting: `docs/guides/security/multi-layer-rate-limiting.md` ✅ COMPLETED
- Secrets Manager: `docs/guides/security/secrets-manager.md` ✅ COMPLETED
- Supabase Auth Docs: `docs/guides/security/supabase-auth-docs.md` ✅ COMPLETED

**Current Status:** Documentation exists for core patterns. Missing some advanced implementation guides.

**Codebase area:** `packages/crypto-provider/` — Cryptographic abstraction layer

**Related files:** Existing security infrastructure, authentication system, secrets management

**Dependencies:** Node.js crypto module, NIST PQC algorithms, existing security packages

**Prior work:** Basic cryptography may exist but lacks post-quantum abstraction and migration support

**Constraints:** Must support NIST FIPS 203/204/205 standards and provide seamless migration path

---

## Tech Stack

| Layer     | Technology                                                    |
| --------- | ------------------------------------------------------------- |
| Crypto    | Node.js crypto with PQC abstraction                           |
| Standards | NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA) |
| Migration | RSA → Hybrid → ML-DSA phases                                  |
| Security  | Cryptographic provider interface                              |

---

## Acceptance Criteria

- [ ] **[Agent]** Implement CryptoProvider interface following section 4.7 specification
- [ ] **[Agent]** Create RSACryptoProvider (Phase 1 - Current)
- [ ] **[Agent]** Implement HybridCryptoProvider (Phase 2 - Transition)
- [ ] **[Agent]** Add MLDSACryptoProvider (Phase 3 - Post-quantum)
- [ ] **[Agent]** Create provider factory with migration phase configuration
- [ ] **[Agent]** Add comprehensive test suite for all providers
- [ ] **[Agent]** Implement key management and rotation capabilities
- [ ] **[Agent]** Add performance benchmarks for cryptographic operations
- [ ] **[Human]** Verify abstraction layer supports seamless migration

---

## Implementation Plan

- [ ] **[Agent]** **Analyze section 4.7 specification** — Extract NIST PQC requirements and migration phases
- [ ] **[Agent]** **Create provider interface** — Define CryptoProvider interface with all required methods
- [ ] **[Agent]** **Implement RSA provider** — Create RSACryptoProvider for current phase
- [ ] **[Agent]** **Implement hybrid provider** — Create HybridCryptoProvider for transition phase
- [ ] **[Agent]** **Implement PQC provider** — Create MLDSACryptoProvider for post-quantum phase
- [ ] **[Agent]** **Create provider factory** — Implement createCryptoProvider function
- [ ] **[Agent]** **Add key management** — Implement key generation, rotation, and storage
- [ ] **[Agent]** **Create test suite** — Test all providers and migration scenarios
- [ ] **[Agent]** **Add performance benchmarks** — Measure cryptographic operation performance

> ⚠️ **Agent Question**: Ask human before proceeding if any existing cryptographic operations need migration.

---

## Commands

```bash
# Test crypto providers
pnpm test --filter="@repo/crypto-provider"

# Test RSA provider
node -e "
import { createCryptoProvider } from '@repo/crypto-provider';
const provider = createCryptoProvider('rsa');
const signature = await provider.sign(new TextEncoder().encode('test'));
console.log('RSA signature:', signature);
"

# Test hybrid provider
node -e "
import { createCryptoProvider } from '@repo/crypto-provider';
const provider = createCryptoProvider('hybrid');
const encrypted = await provider.encrypt('secret message');
console.log('Hybrid encrypted:', encrypted);
"

# Benchmark performance
pnpm test --filter="@repo/crypto-provider" -- --benchmark
```

---

## Code Style

```typescript
// ✅ Correct — Post-quantum cryptography abstraction following section 4.7
// ============================================================================
// CryptoProvider Interface
// Abstraction over RSA (current), Hybrid (transition), ML-DSA (FIPS 204 future)
// Migration timeline:
//   Phase 1 (Now–2026):   RSA-2048 / AES-256 (current)
//   Phase 2 (2026–2027):  Hybrid RSA + ML-DSA (dual-sign for interop)
//   Phase 3 (2027+):      ML-DSA only (FIPS 204 compliant)
// ============================================================================

export interface CryptoProvider {
  // Sign a payload (e.g., webhook signatures, audit log integrity)
  sign(payload: Uint8Array): Promise<Uint8Array>;

  // Verify a signature
  verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean>;

  // Encrypt a value (e.g., per-tenant secrets, PII)
  encrypt(plaintext: string): Promise<string>;

  // Decrypt a value
  decrypt(ciphertext: string): Promise<string>;

  // Name of the algorithm (for audit logs)
  algorithmName: string;
}

// Configuration (set per tenant via site.config.ts compliance.pqc)
export type MigrationPhase = 'rsa' | 'hybrid' | 'pqc';

export function createCryptoProvider(phase: MigrationPhase): CryptoProvider {
  switch (phase) {
    case 'rsa':
      return new RSACryptoProvider();
    case 'hybrid':
      return new HybridCryptoProvider();
    case 'pqc':
      return new MLDSACryptoProvider();
    default:
      return new RSACryptoProvider();
  }
}

// Phase 1 - Current RSA Implementation
export class RSACryptoProvider implements CryptoProvider {
  readonly algorithmName = 'RSA-2048-PSS / AES-256-GCM';

  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor() {
    // Keys loaded from environment (rotated via runbook)
    this.privateKey = crypto.createPrivateKey(process.env.CRYPTO_PRIVATE_KEY!);
    this.publicKey = crypto.createPublicKey(process.env.CRYPTO_PUBLIC_KEY!);
  }

  async sign(payload: Uint8Array): Promise<Uint8Array> {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(payload);
    return new Uint8Array(
      sign.sign({ key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING })
    );
  }

  async verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(payload);
    return verify.verify(
      { key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
      Buffer.from(signature)
    );
  }

  async encrypt(plaintext: string): Promise<string> {
    // AES-256-GCM for symmetric encryption (RSA too slow for bulk data)
    const key = Buffer.from(process.env.CRYPTO_SYMMETRIC_KEY!, 'base64');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  async decrypt(ciphertext: string): Promise<string> {
    const buf = Buffer.from(ciphertext, 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);

    const key = Buffer.from(process.env.CRYPTO_SYMMETRIC_KEY!, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }
}

// Phase 3 - Post-Quantum ML-DSA Implementation
export class MLDSACryptoProvider implements CryptoProvider {
  readonly algorithmName = 'ML-DSA-87 / AES-256-GCM';

  async sign(payload: Uint8Array): Promise<Uint8Array> {
    // Implementation would use NIST FIPS 204 ML-DSA-87
    // For now, placeholder implementation
    throw new Error('ML-DSA implementation pending NIST library availability');
  }

  async verify(payload: Uint8Array, signature: Uint8Array): Promise<boolean> {
    // Implementation would use NIST FIPS 204 ML-DSA-87
    throw new Error('ML-DSA implementation pending NIST library availability');
  }

  async encrypt(plaintext: string): Promise<string> {
    // Use same AES-256-GCM for symmetric encryption
    const key = Buffer.from(process.env.CRYPTO_SYMMETRIC_KEY!, 'base64');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  async decrypt(ciphertext: string): Promise<string> {
    const buf = Buffer.from(ciphertext, 'base64');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);

    const key = Buffer.from(process.env.CRYPTO_SYMMETRIC_KEY!, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
```

**Post-quantum cryptography principles:**

- Abstraction layer enables seamless migration between cryptographic algorithms
- Phase 1 (RSA) provides current compatibility and performance
- Phase 2 (Hybrid) ensures transition period security
- Phase 3 (PQC) provides quantum-resistant security
- All providers implement the same interface for transparent migration
- Algorithm names are logged for audit and compliance tracking

---

## Boundaries

| Tier             | Scope                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Always**    | Follow section 4.7 specification; implement NIST PQC standards; maintain backward compatibility; support all migration phases                   |
| ⚠️ **Ask first** | Changing cryptographic algorithms; modifying migration timeline; updating key management strategies; breaking existing cryptographic operations |
| 🚫 **Never**     | Skip abstraction layer; hard-code cryptographic algorithms; ignore NIST standards; break backward compatibility during migration                |

---

## Success Verification

- [ ] **[Agent]** Test RSA provider — All operations work correctly with current algorithms
- [ ] **[Agent]** Test hybrid provider — Dual-signature operations work during transition
- [ ] **[Agent]** Test PQC provider — Post-quantum algorithms are properly implemented
- [ ] **[Agent]** Verify provider factory — Correct provider selected based on phase
- [ ] **[Agent]** Test migration scenarios — Seamless transition between phases
- [ ] **[Agent]** Benchmark performance — Cryptographic operations meet performance requirements
- [ ] **[Human]** Test with real cryptographic operations — Webhook signatures, encryption, etc.
- [ ] **[Agent]** Self-audit: re-read Acceptance Criteria above and check each box

---

## Edge Cases & Gotchas

- **PQC library availability:** NIST PQC libraries may not be fully available in Node.js yet
- **Performance impact:** Post-quantum algorithms may have different performance characteristics
- **Key management:** Different algorithms require different key formats and management strategies
- **Migration timing:** Coordinate migration phases with security requirements and compliance deadlines
- **Interoperability:** Ensure hybrid phase maintains compatibility with existing systems

---

## Out of Scope

- Database-level security (handled by RLS in separate task)
- Application-level security (handled by middleware and Server Actions)
- Per-tenant secrets management (handled in separate task)
- Rate limiting and request validation (handled in middleware)

---

## References

- [Section 4.7 Post-Quantum Cryptography Abstraction](docs/plan/domain-4/4.7-post-quantum-cryptography-abstraction.md)
- [Section 4.1 Philosophy](docs/plan/domain-4/4.1-philosophy.md)
- [NIST Post-Quantum Cryptography Standards](https://csrc.nist.gov/Projects/Post-Quantum-Cryptography)
- [FIPS 203 ML-KEM Standard](https://csrc.nist.gov/pubs/fips/203/final/)
- [FIPS 204 ML-DSA Standard](https://csrc.nist.gov/pubs/fips/204/final/)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
