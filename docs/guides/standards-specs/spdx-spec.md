# spdx-spec.md


## Overview

SPDX is a collaborative effort driven by the Linux Foundation and supported by a global community of developers, organizations, and industry experts. The specification provides a standardized framework for creating and exchanging detailed metadata about system components, their relationships, and associated information.

### Key Benefits

- **Supply Chain Transparency**: Complete visibility into software composition
- **License Compliance**: Automated license identification and compliance checking
- **Security Management**: Vulnerability tracking and risk assessment
- **Interoperability**: Standardized format across tools and platforms
- **Legal Compliance**: Support for regulatory requirements and audits

## SPDX 3.0 Features

SPDX 3.0 introduces significant enhancements to support modern software ecosystems:

### Software Composition

- **Packages**: Metadata for collections of software
- **Files**: Individual file information and relationships
- **Snippets**: Portions of files with specific licensing
- **Dependencies**: Detailed dependency mapping and relationships
- **Bundled Components**: Optional and required component tracking

### Build Information

- **Build Processes**: Documentation of build methodologies
- **Build Tools**: Tool identification and configuration
- **Build Configurations**: Settings and parameters used
- **Build Artifacts**: Resulting software artifacts and metadata

### AI and Dataset Support

- **AI Models**: Model descriptions, training data, and provenance
- **Datasets**: Metadata for training and validation datasets
- **Model Lifecycle**: Training, deployment, and versioning information
- **Data Provenance**: Origin and transformation history

### Identity and Provenance

- **Creator Information**: Entity identification and roles
- **Supplier Details**: Supply chain participant information
- **Distributor Tracking**: Distribution channel and method metadata
- **Integrity Verification**: Checksums and cryptographic hashes

### Licensing and Copyright

- **License Identifiers**: Curated list of SPDX license identifiers
- **License Exceptions**: Standardized exception handling
- **License Expressions**: Complex multi-license scenarios
- **Copyright Notices**: Comprehensive copyright statement management

### Security and Quality

- **Vulnerability Data**: Integration with security vulnerability databases
- **Defect Reports**: Quality and issue tracking information
- **Risk Assessment**: Security and quality risk metrics
- **Compliance Data**: Regulatory compliance status

## SPDX Document Structure

### Core Elements

#### SPDX Document

```json
{
  "spdxVersion": "SPDX-3.0",
  "creationInfo": {
    "created": "2026-02-23T10:00:00Z",
    "creators": ["Tool: SPDX-Tools-v3.0", "Organization: Example Corp"]
  },
  "name": "Example Software Package",
  "documentNamespace": "https://example.com/spdx/example-package",
  "elements": [...]
}
```

#### Package Information

```json
{
  "type": "Package",
  "spdxId": "SPDXRef-Package-example-app",
  "name": "example-application",
  "version": "1.0.0",
  "downloadLocation": "https://github.com/example/app",
  "filesAnalyzed": true,
  "licenseConcluded": "MIT",
  "licenseDeclared": "MIT",
  "copyrightText": "Copyright 2026 Example Corp",
  "supplier": "Organization: Example Corp",
  "originator": "Organization: Example Corp"
}
```

#### File Information

```json
{
  "type": "File",
  "spdxId": "SPDXRef-File-main.js",
  "name": "src/main.js",
  "licenseConcluded": "MIT",
  "licenseDeclared": "MIT",
  "copyrightText": "Copyright 2026 Example Corp",
  "checksums": [
    {
      "algorithm": "SHA256",
      "checksumValue": "abc123..."
    }
  ]
}
```

### Relationships

#### Dependency Relationships

```json
{
  "type": "Relationship",
  "spdxElementId": "SPDXRef-Package-example-app",
  "relatedSpdxElement": "SPDXRef-Package-react",
  "relationshipType": "DEPENDS_ON"
}
```

#### Build Relationships

```json
{
  "type": "Relationship",
  "spdxElementId": "SPDXRef-Package-example-app",
  "relatedSpdxElement": "SPDXRef-BuildInfo-webpack",
  "relationshipType": "BUILT_FROM"
}
```

## Implementation Guide

### Creating SPDX Documents

#### Using SPDX Tools

```bash
# Install SPDX tools
npm install -g @spdx/tools

# Generate SPDX from npm package
spdx-node generate --package example-app --output spdx.json

# Validate SPDX document
spdx-tools validate spdx.json
```

#### Manual Creation

```javascript
// Create SPDX document programmatically
const { Document, Package, File } = require('@spdx/spdx-js');

const doc = new Document({
  name: 'my-application',
  namespace: 'https://example.com/spdx/my-app',
  creationInfo: {
    created: new Date().toISOString(),
    creators: ['Tool: Custom-SPDX-Generator'],
  },
});

const pkg = new Package({
  name: 'my-application',
  version: '1.0.0',
  downloadLocation: 'https://github.com/example/my-app',
  licenseConcluded: 'MIT',
  licenseDeclared: 'MIT',
  copyrightText: 'Copyright 2026 Example Corp',
});

doc.addPackage(pkg);
```

### Integration with Build Systems

#### Webpack Integration

```javascript
// webpack.spdx.js
const SPDXPlugin = require('@spdx/webpack-plugin');

module.exports = {
  plugins: [
    new SPDXPlugin({
      output: './dist/spdx.json',
      includeDependencies: true,
      licenseDetection: true,
    }),
  ],
};
```

#### npm Integration

```json
// package.json
{
  "scripts": {
    "spdx": "spdx-node generate --package . --output spdx.json",
    "spdx:validate": "spdx-tools validate spdx.json"
  },
  "devDependencies": {
    "@spdx/tools": "^3.0.0"
  }
}
```

### CI/CD Integration

#### GitHub Actions

```yaml
# .github/workflows/spdx.yml
name: Generate SPDX

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  spdx:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate SPDX
        run: npm run spdx

      - name: Validate SPDX
        run: npm run spdx:validate

      - name: Upload SPDX artifact
        uses: actions/upload-artifact@v3
        with:
          name: spdx-document
          path: spdx.json
```

#### Docker Integration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate SPDX during build
RUN npm run spdx

# Include SPDX in image
COPY spdx.json /app/spdx.json

CMD ["node", "server.js"]
```

## License Management

### License Identification

#### Automatic Detection

```javascript
const { LicenseDetector } = require('@spdx/license-detector');

const detector = new LicenseDetector();

async function detectLicenses(filePath) {
  const result = await detector.analyzeFile(filePath);
  console.log(`License: ${result.license}`);
  console.log(`Confidence: ${result.confidence}`);
  return result;
}
```

#### Manual License Declaration

```json
{
  "type": "Package",
  "spdxId": "SPDXRef-Package-example",
  "licenseDeclared": "MIT AND Apache-2.0",
  "licenseInfoFromFiles": ["MIT", "Apache-2.0"]
}
```

### License Expressions

#### Simple Licenses

```json
"licenseDeclared": "MIT"
```

#### Dual Licensing

```json
"licenseDeclared": "MIT OR Apache-2.0"
```

#### Complex Expressions

```json
"licenseDeclared": "(MIT OR Apache-2.0) AND BSD-3-Clause"
```

#### License Exceptions

```json
"licenseDeclared": "MIT WITH LLVM-exception"
```

## Security Integration

### Vulnerability Scanning

```javascript
const { VulnerabilityScanner } = require('@spdx/vulnerability-scanner');

const scanner = new VulnerabilityScanner({
  databases: ['nvd', 'github-advisories'],
  severity: ['high', 'critical'],
});

async function scanSPDX(spdxDocument) {
  const vulnerabilities = await scanner.scan(spdxDocument);
  return vulnerabilities;
}
```

### SBOM Analysis

```javascript
const { SBOMAnalyzer } = require('@spdx/sbom-analyzer');

async function analyzeDependencies(spdxDocument) {
  const analyzer = new SBOMAnalyzer();
  const analysis = await analyzer.analyze(spdxDocument);

  console.log(`Total packages: ${analysis.packageCount}`);
  console.log(`Direct dependencies: ${analysis.directDependencies}`);
  console.log(`Transitive dependencies: ${analysis.transitiveDependencies}`);
  console.log(`Licenses found: ${analysis.licenses}`);

  return analysis;
}
```

## Compliance and Auditing

### Compliance Checking

```javascript
const { ComplianceChecker } = require('@spdx/compliance-checker');

const checker = new ComplianceChecker({
  allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-3-Clause'],
  forbiddenLicenses: ['GPL-3.0', 'AGPL-3.0'],
  requireCopyright: true,
  requireLicenseText: true,
});

async function checkCompliance(spdxDocument) {
  const result = await checker.check(spdxDocument);

  if (result.compliant) {
    console.log('Document is compliant');
  } else {
    console.log('Compliance issues:', result.issues);
  }

  return result;
}
```

### Audit Trail

```javascript
const { AuditLogger } = require('@spdx/audit-logger');

const logger = new AuditLogger({
  storage: 'file',
  filename: 'spdx-audit.log',
});

async function logSPDXOperation(operation, document, user) {
  await logger.log({
    timestamp: new Date().toISOString(),
    operation,
    documentId: document.documentNamespace,
    user,
    changes: operation === 'modify' ? document.changes : null,
  });
}
```

## Best Practices

### Document Creation

1. **Automate Generation**: Use tools to automatically generate SPDX documents
2. **Include All Dependencies**: Capture both direct and transitive dependencies
3. **Verify Licenses**: Manually review automatically detected licenses
4. **Maintain Accuracy**: Keep SPDX documents updated with changes

### License Management

1. **Use Standard Identifiers**: Always use SPDX license identifiers
2. **Document Exceptions**: Clearly document any license exceptions
3. **Review Complex Expressions**: Ensure license expressions are accurate
4. **Track License Changes**: Monitor for license changes in dependencies

### Security Practices

1. **Regular Scanning**: Scan for vulnerabilities regularly
2. **Integrate with CI/CD**: Include SPDX generation in build pipelines
3. **Monitor Dependencies**: Track dependency updates and changes
4. **Document Security Fixes**: Record security patches in SPDX documents

### Compliance Management

1. **Establish Policies**: Define clear license compliance policies
2. **Automate Checking**: Use automated compliance checking tools
3. **Maintain Audit Trail**: Keep detailed records of compliance activities
4. **Regular Reviews**: Periodically review compliance status

## Tools and Resources

### Official Tools

- [SPDX Tools](https://github.com/spdx/spdx-tools) - Official SPDX command-line tools
- [SPDX JavaScript Library](https://github.com/spdx/spdx-js) - JavaScript/Node.js library
- [SPDX Online Tools](https://tools.spdx.org) - Online SPDX generation and validation

### Third-Party Tools

- [FOSSA](https://fossa.com/) - Commercial license compliance and security scanning
- [Snyk](https://snyk.io/) - Vulnerability scanning and license compliance
- [WhiteSource](https://whitesource.software/) - Open source security and compliance
- [Black Duck](https://www.blackducksoftware.com/) - Comprehensive open source management

### Integration Libraries

- [@spdx/webpack-plugin](https://github.com/spdx/webpack-plugin) - Webpack integration
- [@spdx/maven-plugin](https://github.com/spdx/maven-plugin) - Maven integration
- [@spdx/gradle-plugin](https://github.com/spdx/gradle-plugin) - Gradle integration

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [SPDX Official Website](https://spdx.dev/)
- [SPDX 3.0 Specification](https://spdx.github.io/spdx-spec/v3.0.1/)
- [SPDX License List](https://spdx.org/licenses/)
- [Linux Foundation SPDX Project](https://www.linuxfoundation.org/spdx)
- [SPDX GitHub Organization](https://github.com/spdx)
- [NTIA Software Bill of Materials](https://www.ntia.gov/sbom)
- [CISA SBOM Guidance](https://www.cisa.gov/sbom)


## Testing

[Add content here]