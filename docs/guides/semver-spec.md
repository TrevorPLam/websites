# Semantic Versioning 2.0.0 Specification

## Summary

Given a version number **MAJOR.MINOR.PATCH**, increment the:

1. **MAJOR** version when you make incompatible API changes
2. **MINOR** version when you add functionality in a backwards compatible manner
3. **PATCH** version when you make backwards compatible bug fixes

Additional labels for pre-release and build metadata are available as extensions to the **MAJOR.MINOR.PATCH** format .

## Introduction

In the world of software management there exists a dread place called "dependency hell."
The bigger your system grows and the more packages you integrate into your software, the more
likely you are to find yourself, one day, in this pit of despair.

In systems with many dependencies, releasing new package versions can quickly become a nightmare.
If the dependency specifications are too tight, you are in danger of version lock (the inability
to upgrade a package without having to release new versions of every dependent package).
If dependencies are specified too loosely, you will inevitably be bitten by version promiscuity
(assuming compatibility with more future versions than is reasonable).

As a solution to this problem, Semantic Versioning proposes a simple set of rules and requirements that dictate how version numbers are assigned and incremented .

## Semantic Versioning Specification (SemVer)

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://tools.ietf.org/html/rfc2119) .

1. **Software using Semantic Versioning MUST declare a public API.** This API could be declared in the code itself or exist strictly in documentation. However it is done, it should be precise and comprehensive .

2. **A normal version number MUST take the form X.Y.Z** where X, Y, and Z are non-negative integers, and MUST NOT contain leading zeroes. X is the major version, Y is the minor version, and Z is the patch version. Each element MUST increase numerically. For instance: `1.9.0` -> `1.10.0` -> `1.11.0` .

3. **Once a versioned package has been released, the contents of that version MUST NOT be modified.** Any modifications MUST be released as a new version .

4. **Major version zero (0.y.z) is for initial development.** Anything may change at any time. The public API should not be considered stable .

5. **Version 1.0.0 defines the public API.** The way in which the version number is incremented after this release is dependent on this public API and how it changes .

6. **Patch version Z (x.y.Z | x > 0) MUST be incremented** if only backwards compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behavior .

7. **Minor version Y (x.Y.z | x > 0) MUST be incremented** if new, backwards compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes. Patch version MUST be reset to 0 when minor version is incremented .

8. **Major version X (X.y.z | X > 0) MUST be incremented** if any backwards incompatible changes are introduced to the public API. It MAY include minor and patch level changes. Patch and minor version MUST be reset to 0 when major version is incremented .

9. **A pre-release version MAY be denoted** by appending a hyphen and a series of dot separated identifiers immediately following the patch version. Identifiers MUST comprise only ASCII alphanumerics and hyphen `[0-9A-Za-z-]`. Identifiers MUST NOT be empty. Numeric identifiers MUST NOT include leading zeroes. Pre-release versions have a lower precedence than the associated normal version. A pre-release version indicates that the version is unstable and might not satisfy the intended compatibility requirements as denoted by its associated normal version. Examples: `1.0.0-alpha`, `1.0.0-alpha.1`, `1.0.0-0.3.7`, `1.0.0-x.7.z.92` .

10. **Build metadata MAY be denoted** by appending a plus sign and a series of dot separated identifiers immediately following the patch or pre-release version. Identifiers MUST comprise only ASCII alphanumerics and hyphen `[0-9A-Za-z-]`. Identifiers MUST NOT be empty. Build metadata SHOULD be ignored when determining version precedence. Thus two versions that differ only in the build metadata, have the same precedence. Examples: `1.0.0-alpha+001`, `1.0.0+20130313144700`, `1.0.0-beta+exp.sha.5114f85` .

11. **Precedence** refers to how versions are compared to each other when ordered. Precedence MUST be calculated by separating the version into major, minor, patch and pre-release identifiers in that order (Build metadata does not figure into precedence). Precedence is determined by the first difference when comparing each of these identifiers from left to right as follows: Major, minor, and patch versions are always compared numerically. Example: `1.0.0 < 2.0.0 < 2.1.0 < 2.1.1`. When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version. Example: `1.0.0-alpha < 1.0.0`. Precedence for two pre-release versions with the same major, minor, and patch version MUST be determined by comparing each dot separated identifier from left to right until a difference is found as follows: identifiers consisting of only digits are compared numerically and identifiers with letters or hyphens are compared lexically in ASCII sort order. Numeric identifiers always have lower precedence than non-numeric identifiers. A larger set of pre-release fields has a higher precedence than a smaller set, if all of the preceding identifiers are equal. Example: `1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0` .

## 2026 Enhancements and Clarifications

### 12. **API Stability and Communication**

Software using Semantic Versioning MUST communicate API stability through version numbers and documentation:

- **Stable APIs**: Version 1.0.0 and above indicate stable, backward-compatible APIs
- **Development APIs**: Version 0.x.y indicates development phase with potential breaking changes
- **Deprecation Notices**: Deprecated APIs MUST remain functional until the next major version
- **Migration Guides**: Major version changes SHOULD include migration documentation

### 13. **Package Management Integration**

Modern package managers SHOULD implement enhanced SemVer support:

- **Range Resolution**: Support for caret (^), tilde (~), and exact version ranges
- **Security Updates**: Automatic patch version updates for security fixes
- **Compatibility Checking**: Validation of dependency compatibility constraints
- **Conflict Resolution**: Automated resolution of version conflicts where possible

### 14. **Security and Supply Chain Considerations**

2026 security best practices for SemVer:

- **Vulnerability Disclosure**: Security patches SHOULD be released as patch versions when possible
- **Signed Releases**: Package distributions SHOULD be cryptographically signed
- **Provenance Metadata**: Build metadata MAY include supply chain provenance information
- **Automated Updates**: Critical security updates MAY bypass normal version constraints

### 15. **Monorepo and Workspace Considerations**

For monorepo environments:

- **Coordinated Releases**: Related packages SHOULD release compatible versions together
- **Internal Dependencies**: Workspace dependencies SHOULD use compatible version ranges
- **Breaking Changes**: Coordinated major version bumps across dependent packages
- **Release Automation**: Automated tools SHOULD enforce SemVer rules across packages

## Why Use Semantic Versioning?

By giving a name and clear definition to versioning ideas, it becomes easy to communicate your intentions to the users of your software. Once these intentions are clear, flexible (but not too flexible) dependency specifications can finally be made .

A simple example will demonstrate how Semantic Versioning can make dependency hell a thing of the past. Consider a library called "Firetruck." It requires a Semantically Versioned package named "Ladder." At the time that Firetruck is created, Ladder is at version 3.1.0. Since Firetruck uses some functionality that was first introduced in 3.1.0, you can safely specify the Ladder dependency as greater than or equal to 3.1.0 but less than 4.0.0. Now, when Ladder version 3.1.1 and 3.2.0 become available, you can release them to your package management system and know that they will be compatible with existing dependent software .

## 2026 Best Practices

### Version Numbering Strategy

1. **Start at 0.1.0**: Initial development should begin at 0.1.0, not 0.0.1
2. **Use 1.0.0 for Stable Release**: Move to 1.0.0 when the API is considered stable
3. **Patch Frequently**: Release patch versions for bug fixes and small improvements
4. **Minor for Features**: Use minor versions for new, backward-compatible features
5. **Major for Breaking Changes**: Reserve major versions for incompatible API changes

### Dependency Management

1. **Use Caret Ranges**: Default to ^1.0.0 for dependencies expecting compatible updates
2. **Lock Critical Dependencies**: Use exact versions for critical or security-sensitive dependencies
3. **Regular Updates**: Update dependencies regularly to avoid security vulnerabilities
4. **Test Compatibility**: Thoroughly test dependency updates before deployment

### Communication and Documentation

1. **Document Breaking Changes**: Provide clear documentation for all major version changes
2. **Changelog Maintenance**: Maintain detailed changelogs for all versions
3. **Migration Guides**: Provide migration guides for major version transitions
4. **Deprecation Warnings**: Clearly mark deprecated features with removal timelines

### Release Process

1. **Automated Testing**: Ensure comprehensive test coverage before releases
2. **Version Bumping**: Use automated tools for consistent version bumping
3. **Release Notes**: Include detailed release notes with each version
4. **Rollback Planning**: Have rollback procedures for critical issues

## Common Misconceptions

### Misconception 1: "Patch versions never break anything"

**Reality**: While patch versions SHOULD NOT contain breaking changes, bugs in the implementation might still cause issues in edge cases.

### Misconception 2: "Minor versions are always safe to upgrade"

**Reality**: Minor versions may introduce new features that could affect existing behavior in unexpected ways.

### Misconception 3: "Major versions mean everything breaks"

**Reality**: Major versions only break the documented public API; internal implementation changes that don't affect the API should not require a major version.

### Misconception 4: "Version 0.x is unstable"

**Reality**: While version 0.x allows for breaking changes, it doesn't mean the software is unusable or unreliable—it simply means the API is still evolving.

## Tools and Automation

### Version Management Tools

- **npm version**: Built-in npm command for version bumping
- **yarn version**: Yarn's version management command
- **pnpm version**: pnpm's version management with workspace support
- **Changesets**: Advanced version management for monorepos
- **Lerna**: Tool for managing JavaScript multi-package repositories

### CI/CD Integration

- **Automated Publishing**: Configure CI to automatically publish versioned packages
- **Version Validation**: Validate SemVer compliance in CI pipelines
- **Dependency Checks**: Check for dependency compatibility issues
- **Release Automation**: Automate version bumping and release processes

### Monitoring and Analytics

- **Usage Tracking**: Monitor which versions are being used in production
- **Adoption Rates**: Track adoption of new versions
- **Issue Correlation**: Correlate issues with specific versions
- **Performance Metrics**: Monitor performance across versions
