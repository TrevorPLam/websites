# Version Sync Script Implementation Guide

## Problem: Version Drift

Version drift occurs when the canonical version of your project becomes inconsistent across the multiple files that declare or reference it. In a typical repository, the "version" can appear in: `package.json`, `pyproject.toml`, `setup.py`, `Cargo.toml`, `__version__.py`, `README.md` (badges or install snippets), `CHANGELOG.md` headers, `docs/conf.py` (Sphinx), OpenAPI `info.version`, Docker image tags, and CI workflow environment variables. When these fall out of sync, tooling breaks, users see incorrect version numbers in docs, and release pipelines fail unpredictably.[1][2]

## Design Principles

The correct architecture establishes a **single source of truth (SSoT)**. Every other version declaration is downstream of one authoritative file — typically `package.json` for Node.js projects, `pyproject.toml` for Python, or a dedicated `VERSION` file for polyglot repos. The sync script reads from the SSoT and propagates it outward using deterministic regex substitution. It should be idempotent (running it twice has the same effect as running it once) and safe to run in CI (exits non-zero on any failure, writes nothing if the version is already consistent).[2]

## File Discovery Strategy

Before writing a sync script, audit your repo for all version-bearing files:

```bash
# Find all version declarations across your repo
grep -rn --include="*.toml" --include="*.json" --include="*.py" \
     --include="*.md" --include="*.yaml" --include="*.yml" \
     -E '(version\s*=\s*["\x27][0-9]+\.[0-9]+|v[0-9]+\.[0-9]+\.[0-9]+)' . \
     | grep -v node_modules | grep -v ".git"
```

Run this before implementing the script to map every file that needs updating.

## Full Version Sync Script

```python
#!/usr/bin/env python3
"""
version_sync.py — Single-source-of-truth version synchronization.

Usage:
    python scripts/version_sync.py              # Read from package.json
    python scripts/version_sync.py --check      # Dry-run: report drift, exit 1 if any
    python scripts/version_sync.py --set 2.1.0  # Override version and sync all

Author: generated for implementation sprint
"""

import argparse
import json
import re
import sys
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────
# Map each file relative to repo root to its regex replacement pattern.
# The regex must have exactly one capture group that isolates the version string.
VERSION_FILES = {
    "package.json": (
        r'("version"\s*:\s*")[^"]+(")',
        r'\g<1>{version}\g<2>',
    ),
    "pyproject.toml": (
        r'(version\s*=\s*")[^"]+(")',
        r'\g<1>{version}\g<2>',
    ),
    "setup.py": (
        r'(version\s*=\s*["\x27])[^\x27"]+(["\x27])',
        r'\g<1>{version}\g<2>',
    ),
    "README.md": (
        r'(!\[version\]\(https://img\.shields\.io/badge/version-)[^\-]+-',
        r'\g<1>{version}-',
    ),
    "docs/conf.py": (
        r'(release\s*=\s*["\x27])[^\x27"]+(["\x27])',
        r'\g<1>{version}\g<2>',
    ),
}

# The authoritative source file and how to read it
SSoT_FILE = "package.json"


def read_version_from_source(repo_root: Path) -> str:
    """Read the canonical version from the single source of truth."""
    source = repo_root / SSoT_FILE
    if not source.exists():
        sys.exit(f"ERROR: SSoT file not found: {source}")

    with source.open() as f:
        if SSoT_FILE.endswith(".json"):
            return json.load(f)["version"]
        elif SSoT_FILE.endswith(".toml"):
            # Minimal TOML parse for version line (avoids dependency on `tomllib` < 3.11)
            for line in f:
                m = re.match(r'version\s*=\s*"([^"]+)"', line)
                if m:
                    return m.group(1)
            sys.exit("ERROR: Could not parse version from pyproject.toml")
        else:
            return f.read().strip()


def validate_semver(version: str) -> None:
    """Ensure the version string is valid semver (MAJOR.MINOR.PATCH[-pre][+build])."""
    pattern = r'^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$'
    if not re.match(pattern, version):
        sys.exit(f"ERROR: '{version}' is not a valid semver string.")


def sync_file(
    path: Path,
    version: str,
    pattern: str,
    replacement: str,
    check_only: bool
) -> tuple[bool, str]:
    """
    Update a single file's version declaration.
    Returns (changed: bool, detail: str).
    """
    if not path.exists():
        return False, f"SKIP (not found): {path}"

    content = path.read_text(encoding="utf-8")
    replacement_filled = replacement.replace("{version}", version)

    # Check if the pattern matches at all
    if not re.search(pattern, content):
        return False, f"WARN (pattern not matched): {path}"

    new_content = re.sub(pattern, replacement_filled, content)

    if new_content == content:
        return False, f"OK (already in sync): {path}"

    if not check_only:
        path.write_text(new_content, encoding="utf-8")
        return True, f"UPDATED: {path}"
    else:
        return True, f"DRIFT DETECTED: {path}"


def main():
    parser = argparse.ArgumentParser(description="Sync version across all repository files.")
    parser.add_argument("--check", action="store_true",
                        help="Dry-run mode: report drift without writing files. Exits 1 if any drift found.")
    parser.add_argument("--set", metavar="VERSION", dest="override",
                        help="Override the version to this value instead of reading from SSoT.")
    parser.add_argument("--root", default=".", help="Path to repository root (default: cwd)")
    args = parser.parse_args()

    repo_root = Path(args.root).resolve()
    version = args.override if args.override else read_version_from_source(repo_root)
    validate_semver(version)

    mode = "CHECK" if args.check else "SYNC"
    print(f"\n[version-sync] Mode: {mode} | Version: {version}\n")

    drift_found = False
    for filename, (pattern, replacement) in VERSION_FILES.items():
        changed, detail = sync_file(
            repo_root / filename, version, pattern, replacement, args.check
        )
        if changed:
            drift_found = True
        print(f"  {detail}")

    print()
    if args.check and drift_found:
        print("Result: VERSION DRIFT DETECTED. Run without --check to fix.")
        sys.exit(1)
    elif args.check:
        print("Result: All files in sync.")
    else:
        print("Result: Sync complete.")


if __name__ == "__main__":
    main()
```

## Integration Points

**Pre-commit (local enforcement):**
```yaml
# .pre-commit-config.yaml
- repo: local
  hooks:
    - id: version-sync-check
      name: Check version consistency
      language: python
      entry: python scripts/version_sync.py --check
      pass_filenames: false
      always_run: true
```

**CI enforcement (GitHub Actions job):**
```yaml
- name: Verify version sync
  run: python scripts/version_sync.py --check
```

**Release automation:**
```bash
# In your release script or Makefile
npm version minor              # Updates package.json
python scripts/version_sync.py  # Propagates to all other files
git add -A && git commit -m "chore: bump version to $(node -p "require('./package.json').version")"
```

## Edge Cases and Gotchas

- **TOML files**: Python < 3.11 does not include `tomllib` in the standard library. Either add `tomli` as a dev dependency, or use the regex approach shown above (which is sufficient for simple `version = "x.y.z"` declarations).
- **Changelog headers**: Version bumps in `CHANGELOG.md` are usually narrative and should not be automatically overwritten. Exclude CHANGELOG from auto-sync and handle it in your release script.
- **Pre-release versions**: The semver validator in the script above accepts `-alpha.1`, `-rc.2`, etc. Ensure your regex patterns account for hyphens if you use them.
- **Multi-workspace monorepos**: For npm workspaces, prefer `npm version <bump> --workspaces` over manual regex — it handles workspace dependencies too.[1]

## References

[1] npm workspaces documentation - https://docs.npmjs.com/cli/v7/using-npm/workspaces
[2] Semantic Versioning specification - https://semver.org/
