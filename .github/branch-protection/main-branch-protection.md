# Main Branch Protection Baseline

Use these repository settings in GitHub branch protection for `main`:

- Require pull request before merging
- Require approvals: 1+
- Require review from Code Owners
- Require conversation resolution before merge
- Require status checks to pass before merging
  - `ci / typecheck`
  - `ci / lint`
  - `ci / test`
  - `ci / build`
  - `security-sast / sast`
  - `Dependency Review / Block vulnerable dependency introductions`
  - `Commit Signature Verification / Verify commit signatures`
- Require signed commits
- Require linear history
- Do not allow force pushes
- Do not allow deletions
