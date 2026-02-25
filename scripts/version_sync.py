#!/usr/bin/env python3
"""
version_sync.py — Single-source-of-truth version synchronization.

Usage:
    python scripts/version_sync.py              # Read from package.json
    python scripts/version_sync.py --check      # Dry-run: report drift, exit 1 if any
    python scripts/version_sync.py --set 2.1.0  # Override version and sync all

Author: generated for marketing websites monorepo
"""

import argparse
import json
import re
import sys
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────
# Map each file relative to repo root to its regex replacement patterns.
# Each file can have multiple patterns to update different version references.
VERSION_FILES = {
    "package.json": [
        (
            r'("version"\s*:\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
    ],
    "README.md": [
        (
            r'(!\[Node\.js Version\]\(https://img\.shields\.io/badge/node-)[^-]+(-\))',
            r'\g<1>{version}\g<2>',
        ),
        (
            r'(!\[TypeScript\]\(https://img\.shields\.io/badge/TypeScript-)[^-]+(-\))',
            r'\g<1>{version}\g<2>',
        ),
    ],
    "tooling/create-site/cli-scaffold-design.md": [
        (
            r'("node":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
        (
            r'("next":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
        (
            r'("react":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
    ],
    "tooling/create-client/cli-scaffold-design.md": [
        (
            r'("node":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
        (
            r'("next":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
        (
            r'("react":\s*")[^"]+(")',
            r'\g<1>{version}\g<2>',
        ),
    ],
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
    patterns: list,
    check_only: bool
) -> tuple[bool, str]:
    """
    Update a single file's version declarations.
    Returns (changed: bool, detail: str).
    """
    if not path.exists():
        return False, f"SKIP (not found): {path}"

    content = path.read_text(encoding="utf-8")
    new_content = content
    total_changes = 0

    for pattern, replacement in patterns:
        replacement_filled = replacement.replace("{version}", version)

        # Check if the pattern matches at all
        if not re.search(pattern, new_content):
            continue

        # Apply the replacement
        updated_content = re.sub(pattern, replacement_filled, new_content)
        if updated_content != new_content:
            new_content = updated_content
            total_changes += 1

    if new_content == content:
        return False, f"OK (already in sync): {path}"

    if not check_only:
        path.write_text(new_content, encoding="utf-8")
        return True, f"UPDATED: {path} ({total_changes} changes)"
    else:
        return True, f"DRIFT DETECTED: {path} ({total_changes} changes)"


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
    for filename, patterns in VERSION_FILES.items():
        changed, detail = sync_file(
            repo_root / filename, version, patterns, args.check
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
