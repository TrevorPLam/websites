# slsa-provenance-spec.md

## Overview

SLSA (Supply-chain Levels for Software Artifacts) provenance is a security framework specification that provides verifiable information about software artifacts, describing where, when, and how something was produced. SLSA is organized into a series of levels that describe increasing security guarantees, helping organizations incrementally improve their supply chain security posture.

## SLSA Framework Structure

### Tracks and Levels

SLSA is organized into multiple tracks, each addressing different aspects of the software supply chain:

**Build Track**: Focuses on the build process and artifact creation
**Source Track**: Addresses source code integrity and change management
**Cross Track Information**: Covers threats and mitigations across tracks

### Security Levels

SLSA defines four progressive security levels:

- **Level 0 (L0)**: No SLSA implementation - represents the baseline
- **Level 1 (L1)**: Basic provenance - requires documented build process
- **Level 2 (L2)**: Versioned build - requires reproducible builds with version control
- **Level 3 (L3)**: Auditable builds - requires non-repudiable provenance and trusted build environment
- **Level 4 (L4)**: Full end-to-end security - requires comprehensive security controls

## Provenance Specification

### Definition

In SLSA terminology, "provenance" refers to verifiable information that can be used to track an artifact back through all the moving parts in a complex supply chain to its origin. It provides verifiable information about software artifacts describing where, when, and how something was produced.

### Provenance Types

**Build Provenance**: Tracks the output of a build process back to the source code used to produce that output
**Source Provenance**: Tracks the creation of source code revisions and the change management processes during their creation

### Build Provenance Schema

The SLSA build provenance uses the in-toto attestation framework with the predicate type `https://slsa.dev/provenance/v1`.

#### Core Structure

```json
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [...],
  "predicateType": "https://slsa.dev/provenance/v1",
  "predicate": {
    "buildDefinition": {
      "buildType": string,
      "externalParameters": object,
      "internalParameters": object,
      "resolvedDependencies": [...]
    },
    "runDetails": {
      "builder": {
        "id": string,
        "builderDependencies": [...],
        "version": {...}
      },
      "metadata": {
        "invocationId": string,
        "startedOn": timestamp,
        "finishedOn": timestamp
      },
      "byproducts": [...]
    }
  }
}
```

#### Resource Descriptor

```json
{
  "uri": string,
  "digest": {
    "sha256": string,
    "sha512": string,
    "gitCommit": string,
    "[string]": string
  },
  "name": string,
  "downloadLocation": string,
  "mediaType": string,
  "content": bytes, // base64-encoded
  "annotations": {
    "[string]": any JSON type
  }
}
```

#### Timestamp Format

Timestamps follow ISO 8601 format: `<YYYY>-<MM>-<DD>T<hh>:<mm>:ss>Z`

### Build Definition

#### buildType

A URI identifying the type of build system. Examples include:

- `https://slsa.dev/github-actions-buildtypes/workflow/v1`
- `https://slsa.dev/gcb-buildtypes/triggered-build/v1`

#### externalParameters

User-controlled parameters that influence the build, such as:

- Build flags and options
- Target platforms
- Configuration values

#### internalParameters

System-controlled parameters that influence the build, such as:

- Environment variables
- System configuration
- Build tool versions

#### resolvedDependencies

List of dependencies used during the build process, including:

- Source code repositories
- Build dependencies
- External libraries

### Run Details

#### Builder Information

```json
{
  "id": "https://github.com/actions/runner",
  "version": {
    "builder": "v2.3.0",
    "os": "ubuntu-20.04"
  },
  "builderDependencies": [
    {
      "uri": "pkg:docker/node",
      "digest": {
        "sha256": "abc123..."
      }
    }
  ]
}
```

#### Build Metadata

```json
{
  "invocationId": "build-12345",
  "startedOn": "2024-01-15T10:30:00Z",
  "finishedOn": "2024-01-15T10:45:00Z"
}
```

## Implementation Requirements

### Level 1 Requirements

**Documentation**: Document the build process and all steps
**Provenance**: Generate basic provenance information
**Verification**: Enable consumers to verify build process

### Level 2 Requirements

**Version Control**: All build inputs must be under version control
**Reproducible Builds**: Builds must be reproducible given the same inputs
**Complete Provenance**: Include complete dependency information

### Level 3 Requirements

**Trusted Build Environment**: Build environment must be trusted and isolated
**Non-repudiable Provenance**: Provenance must be cryptographically signed
**Auditable Logs**: Complete audit trail of all build activities

### Level 4 Requirements

**End-to-end Security**: Comprehensive security controls across the supply chain
**Multi-factor Authentication**: Strong authentication for all build operations
**Continuous Monitoring**: Real-time monitoring and alerting for security events

## Verification Process

### Provenance Verification Steps

1. **Verify Signature**: Validate the cryptographic signature on the provenance
2. **Check Builder**: Verify the builder identity and trustworthiness
3. **Validate Build Type**: Ensure the build type is recognized and trusted
4. **Check Dependencies**: Verify all dependencies are from trusted sources
5. **Validate Timestamps**: Ensure build timestamps are within acceptable ranges
6. **Check Artifacts**: Verify artifact digests match the provenance

### Verification Example

```typescript
interface ProvenanceVerifier {
  verifyProvenance(provenance: Provenance, artifact: Artifact): Promise<boolean>;
}

class SLSAVerifier implements ProvenanceVerifier {
  async verifyProvenance(provenance: Provenance, artifact: Artifact): Promise<boolean> {
    // 1. Verify signature
    const signatureValid = await this.verifySignature(provenance);
    if (!signatureValid) return false;

    // 2. Check builder trust
    const builderTrusted = await this.verifyBuilder(provenance.runDetails.builder);
    if (!builderTrusted) return false;

    // 3. Validate build type
    const buildTypeValid = this.validateBuildType(provenance.buildDefinition.buildType);
    if (!buildTypeValid) return false;

    // 4. Check dependencies
    const dependenciesValid = await this.verifyDependencies(
      provenance.buildDefinition.resolvedDependencies
    );
    if (!dependenciesValid) return false;

    // 5. Verify artifact digest
    const digestValid = this.verifyArtifactDigest(artifact, provenance);
    if (!digestValid) return false;

    return true;
  }
}
```

## Build Type Implementations

### GitHub Actions

**Build Type**: `https://slsa.dev/github-actions-buildtypes/workflow/v1`

**Example Configuration**:

```yaml
name: SLSA Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: slsa-framework/slsa-github-generator@v2
        with:
          provenance: true
```

### Google Cloud Build

**Build Type**: `https://slsa.dev/gcb-buildtypes/triggered-build/v1`

**Example Configuration**:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'builds'
      - 'submit'
      - '--config=cloudbuild.yaml'
      - '.'
```

## Integration Patterns

### CI/CD Integration

**GitHub Actions Integration**:

- Use SLSA GitHub Action generator
- Configure appropriate permissions
- Sign provenance with GitHub's OIDC tokens

**GitLab CI Integration**:

- Use GitLab's built-in provenance generation
- Configure CI/CD variables for build metadata
- Integrate with external signing services

**Jenkins Integration**:

- Use SLSA plugins for Jenkins
- Configure build agents for provenance generation
- Integrate with external key management

### Package Registry Integration

**Docker Hub**:

- Sign container images with provenance
- Use Docker Content Trust
- Integrate with SLSA verification tools

**npm Registry**:

- Publish packages with provenance attestations
- Use npm's built-in provenance support
- Verify packages before installation

**PyPI**:

- Upload provenance with Python packages
- Use PyPI's provenance verification
- Integrate with pip security checks

## Security Considerations

### Threats Addressed

**Tampering**: Provenance prevents unauthorized modifications to artifacts
**Impersonation**: Digital signatures prevent builder impersonation
**Dependency Attacks**: Complete dependency tracking prevents supply chain attacks
**Build Process Attacks**: Verified build environments prevent build process compromises

### Best Practices

**Key Management**:

- Use hardware security modules (HSMs) for signing keys
- Implement key rotation policies
- Use multi-signature schemes for critical operations

**Build Environment Security**:

- Isolate build environments from development systems
- Use immutable build environments
- Implement network segmentation for build systems

**Provenance Storage**:

- Store provenance in tamper-evident storage
- Implement provenance replication for availability
- Use content-addressable storage for integrity

## Compliance and Standards

### Industry Standards

**NIST Cybersecurity Framework**: Aligns with supply chain risk management
**ISO 27001**: Supports information security management
**SOC 2**: Provides assurance for service organizations
**FedRAMP**: Supports federal government requirements

### Regulatory Compliance

**Executive Order 14028**: Improves software supply chain security for federal agencies
**CISA Supply Chain Security**: Provides guidance for critical infrastructure
**EU Cybersecurity Act**: Supports EU cybersecurity requirements

## Tools and Ecosystem

### Verification Tools

**slsa-verifier**: Official SLSA verification tool
**cosign**: Container image signing and verification
**sigstore**: Software signing and transparency log
**in-toto**: Framework for software supply chain security

### Build Tools

**GitHub Actions**: Native SLSA support
**Google Cloud Build**: Built-in provenance generation
**Jenkins**: Plugin ecosystem for SLSA
**Azure DevOps**: Integration with Microsoft security tools

### Monitoring and Analytics

**Supply Chain Dashboard**: Real-time monitoring of SLSA compliance
**Security Analytics**: Advanced threat detection and analysis
**Compliance Reporting**: Automated compliance reporting tools

## Migration Strategy

### Assessment Phase

**Current State Analysis**:

- Inventory existing build processes
- Assess current security controls
- Identify gaps in provenance generation

**Risk Assessment**:

- Evaluate supply chain risks
- Prioritize critical assets
- Define compliance requirements

### Implementation Phase

**Pilot Implementation**:

- Start with low-risk applications
- Implement basic provenance generation
- Test verification processes

**Scale Implementation**:

- Expand to critical applications
- Implement advanced security controls
- Integrate with existing security tools

### Optimization Phase

**Continuous Improvement**:

- Monitor provenance effectiveness
- Optimize build processes
- Enhance security controls

**Compliance Management**:

- Maintain compliance documentation
- Conduct regular audits
- Update security policies

## References

### Official SLSA Documentation

- [SLSA Specification v1.2](https://slsa.dev/spec/v1.2/)
- [SLSA Provenance Specification](https://slsa.dev/spec/v1.2/provenance)
- [SLSA Build Provenance](https://slsa.dev/spec/v1.2/build-provenance)
- [SLSA Verification Guide](https://slsa.dev/spec/v1.2/verifying-artifacts)
- [SLSA Threats and Mitigations](https://slsa.dev/spec/v1.2/threats)

### Build Type Specifications

- [GitHub Actions Build Type](https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1)
- [Google Cloud Build Type](https://slsa-framework.github.io/gcb-buildtypes/triggered-build/v1)
- [Build Type Index](https://slsa.dev/spec/v1.2/build-provenance#build-types)

### Implementation Tools

- [SLSA Framework GitHub](https://github.com/slsa-framework/slsa)
- [in-toto Attestation](https://github.com/in-toto/attestation)
- [Sigstore](https://sigstore.dev/)
- [Cosign](https://github.com/sigstore/cosign)

### Security Standards

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Executive Order 14028](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/)
- [CISA Supply Chain Security](https://www.cisa.gov/news-events/news/cisa-releases-guidance-software-supply-chain-security)
- [EU Cybersecurity Act](https://ec.europa.eu/digital-single-market/en/cybersecurity-act)
