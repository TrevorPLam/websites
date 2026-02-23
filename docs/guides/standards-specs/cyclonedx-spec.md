# cyclonedx-spec.md

## Overview

CycloneDX is an open-source, full-stack Bill of Materials (BOM) standard that provides advanced supply chain capabilities for cyber risk reduction. Developed by the OWASP community, CycloneDX supports multiple BOM types including Software Bill of Materials (SBOM), Software-as-a-Service Bill of Materials (SaaSBOM), Hardware Bill of Materials (HBOM), Operations BOM (OBOM), and Vulnerability Exploitability eXchange (VEX).

## Specification Details

### Current Version

**CycloneDX v1.7** (Latest as of 2025)

### Supported Formats

CycloneDX supports three primary serialization formats:

- **JSON**: `vnd.cyclonedx+json`
- **XML**: `vnd.cyclonedx+xml`
- **Protocol Buffers**: `x.vnd.cyclonedx+protobuf`

### Standards Compliance

- **ECMA-424**: Standard for Software Bill of Materials
- **TC54**: Technical Committee 54 for BOM standards
- **ISO/IEC 5968**: Software identification standards

## Core Object Model

### BOM Structure

The CycloneDX object model is a structured framework for representing supply chain information with the following core components:

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "serialNumber": "urn:uuid:3e671687-395b-41d5-8d8e-0b2c1f5d3d7f",
  "version": 1,
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "tools": [...],
    "component": {...}
  },
  "components": [...],
  "services": [...],
  "dependencies": [...],
  "vulnerabilities": [...]
}
```

### Key Object Types

#### BOM Metadata

Contains supplier, manufacturer, and target component information:

```json
{
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "tools": [
      {
        "vendor": "CycloneDX",
        "name": "cyclonedx-cli",
        "version": "1.7.0"
      }
    ],
    "component": {
      "type": "application",
      "name": "MyApplication",
      "version": "1.0.0"
    }
  }
}
```

#### Components

Describes complete inventory of first-party and third-party components:

```json
{
  "components": [
    {
      "type": "library",
      "group": "org.example",
      "name": "example-library",
      "version": "1.2.3",
      "purl": "pkg:maven/org.example/example-library@1.2.3",
      "hashes": [
        {
          "alg": "SHA-256",
          "content": "abc123..."
        }
      ],
      "licenses": [
        {
          "license": {
            "id": "MIT"
          }
        }
      ],
      "supplier": {
        "name": "Example Organization"
      }
    }
  ]
}
```

#### Services

Represents external APIs and services:

```json
{
  "services": [
    {
      "bom-ref": "service-auth-api",
      "provider": {
        "name": "Authentication Service Provider"
      },
      "name": "Authentication API",
      "version": "2.0.0",
      "endpoints": [
        {
          "url": "https://api.example.com/auth",
          "authentication": "bearer"
        }
      ],
      "data": [
        {
          "flow": "outbound",
          "classification": "PII"
        }
      ]
    }
  ]
}
```

#### Dependencies

Describes component dependency relationships:

```json
{
  "dependencies": [
    {
      "ref": "component-react",
      "dependsOn": ["component-react-dom", "service-auth-api"]
    }
  ]
}
```

#### Vulnerabilities

Communicates known vulnerabilities:

```json
{
  "vulnerabilities": [
    {
      "bom-ref": "vulnerability-CVE-2024-1234",
      "id": "CVE-2024-1234",
      "source": {
        "name": "NVD",
        "url": "https://nvd.nist.gov/vuln/detail/CVE-2024-1234"
      },
      "ratings": [
        {
          "source": {
            "name": "NVD"
          },
          "score": 7.5,
          "severity": "high"
        }
      ],
      "cwes": ["CWE-79"],
      "description": "Cross-site scripting vulnerability",
      "recommendation": "Update to version 2.0.1 or later"
    }
  ]
}
```

## BOM Types

### Software Bill of Materials (SBOM)

The most common CycloneDX use case, representing software components:

**Key Features:**

- Component inventory with metadata
- Dependency relationships
- License information
- Vulnerability associations
- Build and deployment metadata

### Software-as-a-Service Bill of Materials (SaaSBOM)

Extends SBOM for cloud services:

**Key Features:**

- Service endpoints and APIs
- Data flow classification
- Authentication requirements
- Trust boundary information

### Hardware Bill of Materials (HBOM)

Represents hardware components and devices:

**Key Features:**

- Hardware device inventory
- Firmware and software components
- Manufacturer information
- Physical location data

### Operations BOM (OBOM)

Describes operational configurations:

**Key Features:**

- Deployment configurations
- Environment settings
- Operational parameters
- Infrastructure components

### Vulnerability Exploitability eXchange (VEX)

Communicates vulnerability analysis:

**Key Features:**

- Vulnerability analysis results
- Exploitability assessments
- Risk ratings and confidence levels
- Mitigation recommendations

## Advanced Features

### Compositions

Describes constituent parts and completeness:

```json
{
  "compositions": [
    {
      "aggregate": "complete",
      "assemblies": [
        {
          "name": "Production Environment",
          "components": ["component-web-app", "component-api-server"]
        }
      ]
    }
  ]
}
```

### Annotations

Provides additional context and comments:

```json
{
  "annotations": [
    {
      "bom-ref": "annotation-security-review",
      "text": "Security review completed on 2024-01-15",
      "timestamp": "2024-01-15T10:30:00Z",
      "authors": [
        {
          "name": "Security Team",
          "email": "security@example.com"
        }
      ]
    }
  ]
}
```

### Declarations

Describes conformance to standards:

```json
{
  "declarations": [
    {
      "bom-ref": "declaration-owasp-asvs",
      "standard": {
        "name": "OWASP Application Security Verification Standard",
        "version": "4.0"
      },
      "conformance": {
        "target": "Level 2",
        "confidence": "high",
        "attestations": [
          {
            "type": "self-attestation",
            "summary": "Self-assessment completed"
          }
        ]
      }
    }
  ]
}
```

### Extensions

Supports custom extensions for specialized use cases:

```json
{
  "extensions": [
    {
      "schema": "https://example.com/custom-extension/v1",
      "data": {
        "customField": "customValue"
      }
    }
  ]
}
```

## Implementation Guide

### Creating a Basic SBOM

#### Using CycloneDX CLI

```bash
# Install CycloneDX CLI
npm install -g @cyclonedx/cyclonedx-cli

# Generate SBOM from Maven project
cyclonedx-maven -bom -f target/bom.json

# Generate SBOM from npm project
cyclonedx-node -bom -f bom.json

# Generate SBOM from Docker image
cyclonedx-docker -bom -f bom.json myapp:latest
```

#### Manual JSON Creation

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "version": 1,
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "tools": [
      {
        "vendor": "My Company",
        "name": "custom-bom-tool",
        "version": "1.0.0"
      }
    ]
  },
  "components": [
    {
      "type": "library",
      "name": "express",
      "version": "4.18.2",
      "purl": "pkg:npm/express@4.18.2",
      "hashes": [
        {
          "alg": "SHA-256",
          "content": "def123..."
        }
      ],
      "licenses": [
        {
          "license": {
            "id": "MIT"
          }
        }
      ]
    }
  ]
}
```

### Integration with CI/CD

#### GitHub Actions

```yaml
name: Generate SBOM
on: [push, pull_request]

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate SBOM
        run: |
          npm install
          npx @cyclonedx/cyclonedx-node -bom -f sbom.json

      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.json
```

#### Jenkins Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Generate SBOM') {
            steps {
                sh 'npm install'
                sh 'npx @cyclonedx/cyclonedx-node -bom -f sbom.json'
                archiveArtifacts artifacts: 'sbom.json'
            }
        }
    }
}
```

### Vulnerability Integration

#### VEX Generation

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "vulnerabilities": [
    {
      "bom-ref": "vex-CVE-2024-1234",
      "id": "CVE-2024-1234",
      "analysis": {
        "state": "resolved",
        "justification": "Vulnerability has been patched in version 2.0.1",
        "response": [
          {
            "time": "2024-01-15T10:30:00Z",
            "method": "mitigation",
            "details": "Applied security patch"
          }
        ]
      },
      "affects": [
        {
          "ref": "component-vulnerable-library",
          "versions": [
            {
              "range": "1.0.0-1.0.5"
            }
          ]
        }
      ]
    }
  ]
}
```

## Tool Ecosystem

### Official Tools

- **CycloneDX CLI**: Command-line tool for BOM generation
- **CycloneDX Maven Plugin**: Maven integration
- **CycloneDX Gradle Plugin**: Gradle integration
- **CycloneDX Node.js**: npm package integration

### Community Tools

- **Dependency-Track**: Component analysis platform
- **OWASP Dependency Check**: Vulnerability scanner
- **Trivy**: Container and dependency scanner
- **Grype**: Vulnerability scanner for SBOMs

### IDE Integration

#### VS Code Extensions

- **CycloneDX Viewer**: SBOM visualization
- **Dependency Cruiser**: Dependency analysis

#### IntelliJ IDEA

- **CycloneDX Plugin**: SBOM support and visualization

## Security Considerations

### Data Classification

CycloneDX supports data classification for services:

```json
{
  "services": [
    {
      "data": [
        {
          "flow": "inbound",
          "classification": "PII",
          "governance": {
            "custodians": [
              {
                "name": "Data Protection Officer",
                "email": "dpo@example.com"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Distribution Constraints

```json
{
  "distributionConstraints": {
    "tlp": "amber",
    "components": [
      {
        "bom-ref": "component-sensitive-data"
      }
    ]
  }
}
```

### Cryptographic Assets

CycloneDX v1.7 includes support for cryptographic transparency:

```json
{
  "components": [
    {
      "type": "cryptographic-asset",
      "cryptoProperties": {
        "assetType": "certificate",
        "algorithmProperties": {
          "algorithmFamily": "RSA",
          "parameterSetIdentifier": "RSA-2048"
        }
      }
    }
  ]
}
```

## Compliance and Standards

### Regulatory Compliance

**Executive Order 14028**: SBOM requirements for federal agencies
**EU Cyber Resilience Act**: Software supply chain transparency
**FDA Medical Device Guidelines**: SBOM requirements for medical devices

### Industry Standards

**ISO/IEC 5968**: Software identification standards
**NTIA SBOM Minimum Elements**: Federal SBOM requirements
**CISA SBOM Guidance**: Critical infrastructure SBOM requirements

### Certification Programs

**CycloneDX Certification**: Official certification program
**SBOM Compliance**: Third-party compliance validation
**Supply Chain Security**: Comprehensive security assessments

## Best Practices

### SBOM Generation

**Automated Generation**: Integrate SBOM generation into build pipelines
**Complete Coverage**: Include all components, dependencies, and services
**Version Control**: Track SBOM versions alongside software versions
**Regular Updates**: Regenerate SBOMs on component changes

### SBOM Consumption

**Automated Analysis**: Use tools for automated SBOM analysis
**Vulnerability Scanning**: Integrate with vulnerability databases
**License Compliance**: Automate license compliance checking
**Risk Assessment**: Use SBOMs for supply chain risk assessment

### Data Management

**Central Storage**: Store SBOMs in centralized repositories
**Version Control**: Track SBOM versions and changes
**Access Control**: Implement appropriate access controls
**Retention Policies**: Define retention policies for SBOM data

## Migration and Interoperability

### From SPDX to CycloneDX

```bash
# Convert SPDX to CycloneDX
cyclonedx convert --input-file sbom.spdx --output-file sbom.json --output-format json
```

### From Other Formats

CycloneDX supports conversion from various SBOM formats:

- SPDX (Software Package Data Exchange)
- SWID (Software Identification Tags)
- Custom XML/JSON formats

### API Integration

```python
# Python example using cyclonedx-python
from cyclonedx.model import Bom, Component

# Create BOM
bom = Bom()
bom.metadata.tools.append({
    "vendor": "My Company",
    "name": "custom-tool",
    "version": "1.0.0"
})

# Add component
component = Component(
    name="example-library",
    version="1.0.0",
    type="library"
)
bom.components.append(component)

# Export to JSON
with open("sbom.json", "w") as f:
    f.write(bom.as_json())
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Documentation

- [CycloneDX Specification](https://cyclonedx.org/specification/overview/)
- [CycloneDX JSON Reference](https://cyclonedx.org/docs/latest/json/)
- [CycloneDX XML Reference](https://cyclonedx.org/docs/latest/xml/)
- [CycloneDX Protocol Buffers](https://cyclonedx.org/docs/latest/proto/)

### Tools and Libraries

- [CycloneDX CLI](https://github.com/CycloneDX/cyclonedx-cli)
- [CycloneDX Maven Plugin](https://github.com/CycloneDX/cyclonedx-maven-plugin)
- [CycloneDX Node.js](https://github.com/CycloneDX/cyclonedx-node)
- [CycloneDX Python](https://github.com/CycloneDX/cyclonedx-python)

### Standards and Regulations

- [ECMA-424 Software Bill of Materials](https://ecma-international.org/publications-and-standards/standards/ecma-424/)
- [NTIA SBOM Minimum Elements](https://ntia.gov/sbom-minimum-elements/)
- [Executive Order 14028](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/)
- [CISA SBOM Guidance](https://www.cisa.gov/sbom)

### Community Resources

- [CycloneDX GitHub Repository](https://github.com/CycloneDX/specification)
- [CycloneDX Tool Center](https://cyclonedx.org/tool-center/)
- [CycloneDX Community](https://cyclonedx.org/community/)
- [OWASP Supply Chain Security](https://owasp.org/www-project-supply-chain-security/)

## Testing

[Add content here]
