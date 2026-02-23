# github-signing-commits-docs.md

## Overview

GitHub provides comprehensive support for commit signature verification using three different methods: GPG (GNU Privacy Guard), SSH, and S/MIME. These cryptographic signatures allow developers to prove the authenticity and integrity of their commits, providing assurance that the code was authored by the claimed contributor and hasn't been tampered with.

## Signature Verification Methods

### GPG (GNU Privacy Guard)

GPG is the most widely used method for commit signing, providing strong cryptographic guarantees using the OpenPGP standard.

**Requirements:**

- Git 2.0.0 or later
- GPG key generation and management
- Public key uploaded to GitHub account

**Key Characteristics:**

- Uses OpenPGP libraries for verification
- Supports multiple signing keys per account
- Well-established ecosystem with extensive tooling
- Strong cryptographic guarantees

### SSH Signing

SSH signing leverages existing SSH infrastructure, making it convenient for developers who already use SSH for authentication.

**Requirements:**

- Git 2.34 or later
- SSH key generation and management
- Public key uploaded to GitHub account

**Key Characteristics:**

- Uses ssh_data Ruby library for verification
- Can reuse existing SSH authentication keys
- No limit on number of signing keys
- Simpler key management than GPG

### S/MIME (Secure/Multipurpose Internet Mail Extensions)

S/MIME is enterprise-friendly, using X.509 certificates issued by organizations.

**Requirements:**

- Git 2.19 or later
- X.509 certificate from organization
- No need to upload public key to GitHub

**Key Characteristics:**

- Uses Debian ca-certificates package (Mozilla trust store)
- Enterprise certificate authority integration
- No public key upload required
- Suitable for corporate environments

## Implementation Guide

### GPG Setup and Configuration

#### 1. Check for Existing GPG Keys

```bash
# List existing GPG keys
gpg --list-secret-keys --keyid-format=long

# Example output:
# sec   rsa4096/3AA5C34371567BD2 2016-03-10 [SC]
#       4096R/3AA5C34371567BD2 2016-03-10
# uid                 [ultimate] Your Name <your.email@example.com>
```

#### 2. Generate New GPG Key

```bash
# Generate new GPG key
gpg --full-generate-key

# Interactive prompts:
# 1. Key type: RSA and RSA (default)
# 2. Key size: 4096 bits
# 3. Key expiration: 0 (no expiration) or specify date
# 4. Real name: Your Name
# 5. Email address: your.email@example.com
# 6. Comment: (optional)
# 7. Passphrase: Choose strong passphrase
```

#### 3. Add GPG Key to GitHub

```bash
# Export public key
gpg --armor --export your.email@example.com

# Copy the output and add to GitHub:
# GitHub Settings → SSH and GPG keys → New GPG key
```

#### 4. Configure Git for GPG Signing

```bash
# Tell Git about your signing key
git config --global user.signingkey YOUR_GPG_KEY_ID

# Enable commit signing by default
git config --global commit.gpgsign true

# Configure GPG program (if needed)
git config --global gpg.program gpg
```

#### 5. Sign Commits with GPG

```bash
# Sign a single commit
git commit -S -m "Your commit message"

# Sign all commits automatically (if configured)
git commit -m "Your commit message"
```

### SSH Setup and Configuration

#### 1. Check for Existing SSH Keys

```bash
# List existing SSH keys
ls -al ~/.ssh

# Check SSH key fingerprint
ssh-keygen -l -f ~/.ssh/id_rsa.pub
```

#### 2. Generate New SSH Key

```bash
# Generate new SSH key for signing
ssh-keygen -t ed25519 -C "your.email@example.com"

# Or use RSA for compatibility
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```

#### 3. Add SSH Key to GitHub

```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# GitHub Settings → SSH and GPG keys → New SSH key
# Mark as "Signing key" when adding
```

#### 4. Configure Git for SSH Signing

```bash
# Tell Git to use SSH for signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Enable commit signing by default
git config --global commit.gpgsign true
```

#### 5. Sign Commits with SSH

```bash
# Sign a single commit
git commit -S -m "Your commit message"

# Sign all commits automatically (if configured)
git commit -m "Your commit message"
```

### S/MIME Setup and Configuration

#### 1. Obtain X.509 Certificate

```bash
# This typically comes from your organization's PKI
# Certificate should be in PEM format
# Private key should be accessible to Git
```

#### 2. Configure Git for S/MIME

```bash
# Tell Git to use S/MIME for signing
git config --global gpg.format smime
git config --global user.signingkey /path/to/certificate.pem

# Enable commit signing by default
git config --global commit.gpgsign true
```

#### 3. Sign Commits with S/MIME

```bash
# Sign a single commit
git commit -S -m "Your commit message"

# Sign all commits automatically (if configured)
git commit -m "Your commit message"
```

## Verification Process

### GitHub Verification

When signed commits are pushed to GitHub, they undergo automatic verification:

1. **Signature Validation**: GitHub validates the cryptographic signature
2. **Key Matching**: Verifies the public key is associated with the committer
3. **Trust Chain**: Ensures the key is trusted (for S/MIME)
4. **Identity Matching**: Confirms the key identity matches the commit author

### Verification Statuses

**Verified**: Complete verification with trusted key
**Partially Verified**: Signature valid but key not trusted
**Unverified**: No signature or verification failed

### Persistent Verification

GitHub maintains persistent verification records:

```json
{
  "verified": true,
  "reason": "valid",
  "signature": {
    "payload": "...",
    "header": "...",
    "signature": "..."
  },
  "verified_at": "2024-01-15T10:30:00Z"
}
```

**Key Features:**

- Verification records persist even after key rotation
- Scoped to repository network
- Includes verification timestamp
- Cannot be edited after creation

## Advanced Configuration

### Multiple Signing Keys

```bash
# Configure different keys for different repositories
cd /path/to/repo1
git config user.signingkey KEY1_ID

cd /path/to/repo2
git config user.signingkey KEY2_ID
```

### Conditional Signing

```bash
# Sign commits conditionally based on branch
git config --global branch.main.gpgsign true
git config --global branch.feature/* gpgsign false
```

### Key Management

#### GPG Key Rotation

```bash
# Generate new key
gpg --full-generate-key

# Add new key to GitHub
# Remove old key from GitHub
# Update Git configuration
git config --global user.signingkey NEW_KEY_ID
```

#### SSH Key Rotation

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub as signing key
# Remove old key from GitHub
# Update Git configuration
git config --global user.signingkey ~/.ssh/id_ed25519_new.pub
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Signed Commits
on: [push, pull_request]

jobs:
  verify-signatures:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Verify commit signatures
        run: |
          # Verify all commits in the push
          for commit in $(git rev-list HEAD~${{ github.event.push.commits_count }}..HEAD); do
            echo "Verifying commit $commit"
            git verify-commit $commit
          done
```

### Automated Signing in CI

```bash
# Configure CI environment for signing
export GPG_TTY=$(tty)
echo "$GPG_PRIVATE_KEY" | gpg --import --batch --yes
echo "$GPG_PASSPHRASE" | gpg --pinentry-mode loopback --passphrase-fd 0 --import --batch --yes

# Sign commits in CI
git config user.signingkey $GPG_KEY_ID
git config commit.gpgsign true
git commit -S -m "Automated signed commit"
```

## Troubleshooting

### Common Issues

#### GPG Passphrase Prompts

```bash
# Configure gpg-agent to cache passphrase
echo "default-cache-ttl 3600" >> ~/.gnupg/gpg-agent.conf
echo "max-cache-ttl 7200" >> ~/.gnupg/gpg-agent.conf

# Restart gpg-agent
gpgconf --kill gpg-agent
gpg-agent --daemon
```

#### Key Not Found

```bash
# Check which key Git is trying to use
git config user.signingkey

# List available keys
gpg --list-secret-keys --keyid-format=long

# Update Git configuration
git config user.signingkey CORRECT_KEY_ID
```

#### SSH Signing Not Working

```bash
# Check Git version (must be 2.34+)
git --version

# Verify SSH key format
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Test SSH signing
echo "test" | git signblob --stdin
```

### Debug Commands

```bash
# Verbose GPG operations
git config --global gpg.verbose true
git commit -S -m "Test commit"

# Debug SSH signing
GIT_TRACE=1 git commit -S -m "Test commit"

# Check GPG trust database
gpg --check-trustdb
```

## Security Best Practices

### Key Security

**Passphrase Protection:**

- Always use strong passphrases for private keys
- Use gpg-agent or ssh-agent to manage passphrases
- Never store passphrases in plain text

**Key Storage:**

- Store private keys in secure locations
- Use hardware security modules (HSMs) for high-value keys
- Regularly rotate signing keys

**Access Control:**

- Limit access to private keys
- Use separate keys for different purposes
- Implement key revocation procedures

### Organizational Policies

**Key Management:**

- Establish key generation and distribution policies
- Define key rotation schedules
- Implement key escrow for business continuity

**Compliance:**

- Document signing requirements
- Maintain audit trails for signed commits
- Implement verification in security workflows

## Integration Examples

### Enterprise Integration

```bash
# Corporate S/MIME setup
git config --global gpg.format smime
git config --global user.signingkey /corporate/certs/dev.key
git config --global commit.gpgsign true

# Verify corporate signatures
git verify-commit HEAD
```

### Open Source Projects

```bash
# Multiple maintainer keys
git config --global user.signingkey MAINTAINER_KEY_ID

# Contributor verification
git log --show-signature --pretty=format:"%h %s %G?"
```

### Automated Workflows

```bash
# Pre-commit hook for signing
#!/bin/sh
if git config --get commit.gpgsign; then
  git commit -S -m "$1"
else
  git commit -m "$1"
fi
```

## References

### Official GitHub Documentation

- [Signing Commits - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [About Commit Signature Verification - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- [GPG Key Management - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [SSH Key Management - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

### Git Documentation

- [Git Configuration Manual](https://git-scm.com/docs/git-config)
- [Git Signing Documentation](https://git-scm.com/docs/git-signature)
- [Git User Signing Key Configuration](https://git-scm.com/docs/git-config#Documentation/git-config.txt-userSigningKey)

### Security Standards

- [OpenPGP Specification](https://www.rfc-editor.org/rfc/rfc4880)
- [SSH Protocol Specification](https://tools.ietf.org/html/rfc4251)
- [S/MIME Specification](https://tools.ietf.org/html/rfc5751)

### Tool Documentation

- [GnuPG Manual](https://www.gnupg.org/documentation/)
- [OpenSSH Manual](https://man.openbsd.org/sshd)
- [Git Signing Tools](https://git-scm.com/docs/git-signature)

### Integration Guides

- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [Enterprise Security Best Practices](https://docs.github.com/en/enterprise-security)
- [Open Source Security Guidelines](https://docs.github.com/en/organizations/security-guidance)
