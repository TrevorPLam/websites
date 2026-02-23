<!--
/**
 * @file noble-post-quantum-documentation.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for noble post quantum documentation.
 * @entrypoints docs/guides/noble-post-quantum-documentation.md
 * @exports noble post quantum documentation
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# noble-post-quantum-documentation.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


## Overview

`@noble/post-quantum` is an auditable, minimal JavaScript implementation of post-quantum public-key cryptography. Part of the noble cryptography suite, it provides quantum-resistant cryptographic algorithms essential for the post-quantum cryptography (PQC) migration era.

## Key Features

- **Zero or minimal dependencies** - Clean, contained implementation
- **Highly readable TypeScript/JavaScript code** - Easy to audit and understand
- **PGP-signed releases** - Supply chain security guarantees
- **Transparent NPM builds** - Reproducible build process
- **NIST-standardized algorithms** - FIPS-203, FIPS-204, FIPS-205 compliant

## Supported Algorithms

### ML-KEM / Kyber (Key Encapsulation Mechanism)

Lattice-based key encapsulation mechanism defined in FIPS-203 (formerly Kyber).

```typescript
import { ml_kem512, ml_kem768, ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { randomBytes } from '@noble/post-quantum/utils.js';

const seed = randomBytes(64); // seed is optional
const aliceKeys = ml_kem768.keygen(seed);
const { cipherText, sharedSecret: bobShared } = ml_kem768.encapsulate(aliceKeys.publicKey);
const aliceShared = ml_kem768.decapsulate(cipherText, aliceKeys.secretKey);
```

**Usage Pattern:**

1. Alice generates secret & public keys, sends publicKey to Bob
2. Bob generates shared secret for Alice's publicKey (never leaves Bob's system)
3. Alice decrypts cipherText from Bob
4. Both parties now have the same sharedSecret without plaintext exchange

**Security Considerations:**

- Unlike ECDH, KEM doesn't verify the sender's identity
- `decapsulate` returns different shared secrets for different ciphertexts (no error on MITM)
- Probabilistic algorithm relying on CSPRNG quality
- Review djb blog and NIST forum discussions for security concerns

### ML-DSA / Dilithium (Digital Signatures)

Lattice-based digital signature algorithm defined in FIPS-204 (formerly Dilithium).

```typescript
import { ml_dsa44, ml_dsa65, ml_dsa87 } from '@noble/post-quantum/ml-dsa.js';
import { randomBytes } from '@noble/post-quantum/utils.js';

const seed = randomBytes(32); // seed is optional
const keys = ml_dsa65.keygen(seed);
const msg = new TextEncoder().encode('hello noble');
const sig = ml_dsa65.sign(msg, keys.secretKey);
const isValid = ml_dsa65.verify(sig, msg, keys.publicKey);
```

**Security Levels:**

- `ml_dsa44`: Category 1 (~AES-128)
- `ml_dsa65`: Category 3 (~AES-192) - NIST recommended minimum
- `ml_dsa87`: Category 5 (~AES-256)

### SLH-DSA / SPHINCS+ (Hash-based Signatures)

Hash-based digital signature algorithm defined in FIPS-205 (formerly SPHINCS+).

```typescript
import {
  slh_dsa_sha2_128f as sph,
  slh_dsa_sha2_128s,
  slh_dsa_sha2_192f,
  slh_dsa_sha2_192s,
  slh_dsa_sha2_256f,
  slh_dsa_sha2_256s,
  slh_dsa_shake_128f,
  slh_dsa_shake_128s,
  slh_dsa_shake_192f,
  slh_dsa_shake_192s,
  slh_dsa_shake_256f,
  slh_dsa_shake_256s,
} from '@noble/post-quantum/slh-dsa.js';

const keys2 = sph.keygen();
const msg2 = new TextEncoder().encode('hello noble');
const sig2 = sph.sign(msg2, keys2.secretKey);
const isValid2 = sph.verify(sig2, msg2, keys2.publicKey);
```

**Algorithm Variants:**

- **Hash Function**: `sha2` vs `shake` (SHA3) - internal hash function
- **Security Level**: `128`/`192`/`256` - bits of security
- **Performance**: `s` (small) vs `f` (fast) - size vs speed trade-off

**Performance Note:** SLH-DSA is slower than lattice-based alternatives but offers conservative security based on well-understood hash primitives.

### Hybrid Cryptography

Combines post-quantum algorithms with classical elliptic curve cryptography for transitional security.

```typescript
import {
  ml_kem768_x25519,
  ml_kem768_p256,
  ml_kem1024_p384,
  KitchenSink_ml_kem768_x25519,
  XWing,
  QSF_ml_kem768_p256,
  QSF_ml_kem1024_p384,
} from '@noble/post-quantum/hybrid.js';
```

**Available Hybrids:**

- `ml_kem768_x25519`: ML-KEM-768 + X25519 (CG Framework, same as XWing)
- `ml_kem768_p256`: ML-KEM-768 + P-256 (CG Framework)
- `ml_kem1024_p384`: ML-KEM-1024 + P-384 (CG Framework)
- `KitchenSink_ml_kem768_x25519`: ML-KEM-768 + X25519 with HKDF-SHA256 combiner
- `QSF_ml_kem768_p256`: ML-KEM-768 + P-256 (QSF construction)
- `QSF_ml_kem1024_p384`: ML-KEM-1024 + P-384 (QSF construction)

**Supported Standards:**

- IRTF CFRG Hybrid KEMs (draft-irtf-cfrg-hybrid-kems-07)
- IRTF CFRG Concrete Hybrid KEMs (draft-irtf-cfrg-concrete-hybrid-kems-02)
- XWing KEM (draft-connolly-cfrg-xwing-kem-09)
- TLS XYber768D00 (draft-tls-westerbaan-xyber768d00-03)

## Security Recommendations

### Algorithm Selection

**NIST Guidance for Security Categories:**

- **Category 3 (~AES-192)**: ML-KEM-768, ML-DSA-65, SLH-DSA-192
- **Category 5 (~AES-256)**: ML-KEM-1024, ML-DSA-87, SLH-DSA-256

**Recommended Usage:**

- **Key Agreement**: ECC + ML-KEM (hybrid approach)
- **Digital Signatures**: ECC + SLH-DSA (conservative approach)

**Regional Requirements:**

- **NIST**: Category 3+ recommended
- **Australian ASD**: Category 5 only after 2030
- **NSA CNSA 2.0**: PQC algorithms required by 2025 for some applications

### Migration Timeline

- **2025**: NSA CNSA 2.0 compliance deadline for some applications
- **2030**: Australian ASD Category 5 requirement
- **2035**: NIST IR 8547 prohibits classical cryptography (RSA, DSA, ECDSA, ECDH)

### Complementary Cryptography

**Hash Functions**: Use SHA512 or SHA3-512 (avoid SHA256)
**Symmetric Ciphers**: AES-256 or ChaCha20
**Key Exchange**: Hybrid approaches during transition

## Installation

```bash
npm install @noble/post-quantum
```

## Security Considerations

### Audit Status

The library has **not been independently audited yet**. Users should:

- Investigate any unusual behavior
- Report security concerns promptly
- Consider additional security reviews for production use

### Implementation Notes

- **Constant-time operations** where applicable
- **Supply chain security** via PGP-signed releases
- **Randomness** quality critical for probabilistic algorithms
- **Side-channel resistance** considerations in implementation

## Performance Characteristics

### Key Sizes (approximate)

- **ML-KEM-768**: Public key ~1184 bytes, ciphertext ~1088 bytes
- **ML-DSA-65**: Public key ~1952 bytes, signature ~3309 bytes
- **SLH-DSA-128f**: Public key ~32 bytes, signature ~7856 bytes

### Operation Speed

- **ML-KEM/ML-DSA**: Fastest (lattice-based)
- **SLH-DSA**: Slower (hash-based, more conservative)
- **Hybrid**: Slightly slower than PQC-only due to ECC operations

## Integration Examples

### Web Application Integration

```typescript
// Key generation for user registration
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

async function generateUserKeys() {
  const userKeys = ml_kem768.keygen();
  // Store publicKey in database, keep secretKey secure
  return {
    publicKey: Buffer.from(userKeys.publicKey).toString('base64'),
    keyId: generateKeyId(),
  };
}

// Secure message exchange
async function establishSession(userPublicKey, serverPrivateKey) {
  const { cipherText, sharedSecret } = ml_kem768.encapsulate(Buffer.from(userPublicKey, 'base64'));

  // Use sharedSecret for symmetric encryption
  const sessionKey = deriveSymmetricKey(sharedSecret);

  return {
    cipherText: Buffer.from(cipherText).toString('base64'),
    sessionKey,
  };
}
```

### API Authentication

```typescript
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';

class PQCAuthenticator {
  constructor(privateKey) {
    this.keys = { secretKey: privateKey };
  }

  signRequest(requestData) {
    const message = new TextEncoder().encode(JSON.stringify(requestData));
    const signature = ml_dsa65.sign(message, this.keys.secretKey);

    return {
      ...requestData,
      signature: Buffer.from(signature).toString('base64'),
      algorithm: 'ML-DSA-65',
      timestamp: Date.now(),
    };
  }

  static verifySignature(signedRequest, publicKey) {
    const { signature, ...requestData } = signedRequest;
    const message = new TextEncoder().encode(JSON.stringify(requestData));

    return ml_dsa65.verify(
      Buffer.from(signature, 'base64'),
      message,
      Buffer.from(publicKey, 'base64')
    );
  }
}
```

## Testing and Validation

```typescript
import { ml_kem768, ml_dsa65 } from '@noble/post-quantum';

// Test KEM operations
function testKEM() {
  const keys = ml_kem768.keygen();
  const { cipherText, sharedSecret: bobShared } = ml_kem768.encapsulate(keys.publicKey);
  const aliceShared = ml_kem768.decapsulate(cipherText, keys.secretKey);

  console.assert(
    Buffer.from(bobShared).equals(Buffer.from(aliceShared)),
    'KEM shared secrets should match'
  );
}

// Test signature operations
function testSignatures() {
  const keys = ml_dsa65.keygen();
  const message = new TextEncoder().encode('test message');
  const signature = ml_dsa65.sign(message, keys.secretKey);
  const isValid = ml_dsa65.verify(signature, message, keys.publicKey);

  console.assert(isValid, 'Signature should verify');
}
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [noble-post-quantum GitHub Repository](https://github.com/paulmillr/noble-post-quantum)
- [FIPS-203: ML-KEM Specification](https://doi.org/10.6028/NIST.FIPS.203)
- [FIPS-204: ML-DSA Specification](https://doi.org/10.6028/NIST.FIPS.204)
- [FIPS-205: SLH-DSA Specification](https://doi.org/10.6028/NIST.FIPS.205)
- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/Projects/post-quantum-cryptography)
- [NIST IR 8547: Quantum-Resistant Cryptography Timeline](https://doi.org/10.6028/NIST.IR.8547)
- [Australian ASD Cryptography Guidelines](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism/cyber-security-guidelines/guidelines-cryptography)
- [NSA CNSA 2.0 Suite](https://www.nsa.gov/Cybersecurity/NSA-is-Transitioning-to-Quantum-Resistant-Algorithms/)
- [IRTF CFRG Hybrid KEMs Draft](https://datatracker.ietf.org/doc/draft-irtf-cfrg-hybrid-kems/)
- [XWing KEM Specification](https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/)
- [noble Cryptography Homepage](https://paulmillr.com/noble/)


## Best Practices

[Add content here]
