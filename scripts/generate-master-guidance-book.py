#!/usr/bin/env python3
from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parents[1]
GUIDES_DIR = REPO_ROOT / "docs" / "guides"
OUTPUT_FILE = GUIDES_DIR / "MASTER_GUIDANCE_BOOK.md"

RELATED_FIRST_ORDER = [
    "architecture",
    "best-practices",
    "frontend",
    "backend-data",
    "multi-tenant",
    "security",
    "testing",
    "observability",
    "infrastructure-devops",
    "build-monorepo",
    "linting",
    "cms-content",
    "email",
    "payments-billing",
    "scheduling",
    "seo-metadata",
    "accessibility-legal",
    "standards-specs",
    "ai-automation",
    "monitoring",
]


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"\s+", "-", value)
    return value


def titleize_group(group: str) -> str:
    if group == "_root":
        return "General & Cross-Cutting Guides"
    return group.replace("-", " ").title()


def normalize_headings(text: str, section_shift: int = 3) -> str:
    normalized: list[str] = []
    in_code_fence = False

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code_fence = not in_code_fence
            normalized.append(line)
            continue

        if not in_code_fence:
            match = re.match(r"^(#{1,6})\s+(.*)$", line)
            if match:
                level = min(len(match.group(1)) + section_shift, 6)
                heading_text = match.group(2).strip()
                normalized.append(f"{'#' * level} {heading_text}")
                continue

        normalized.append(line)

    return "\n".join(normalized).strip() + "\n"


def discover_files() -> list[Path]:
    files = [
        p
        for p in GUIDES_DIR.rglob("*.md")
        if p.is_file() and p.resolve() != OUTPUT_FILE.resolve()
    ]
    return sorted(files, key=lambda p: p.relative_to(GUIDES_DIR).as_posix())


def group_for(rel_path: Path) -> str:
    parts = rel_path.parts
    if len(parts) == 1:
        return "_root"
    return parts[0]


def ordered_groups(groups: set[str]) -> list[str]:
    remaining = sorted(g for g in groups if g not in set(RELATED_FIRST_ORDER) and g != "_root")
    ordered = [g for g in RELATED_FIRST_ORDER if g in groups]
    ordered.extend(remaining)
    if "_root" in groups:
        ordered.append("_root")
    return ordered


def build_book(files: list[Path]) -> str:
    grouped: dict[str, list[Path]] = defaultdict(list)
    for file_path in files:
        grouped[group_for(file_path.relative_to(GUIDES_DIR))].append(file_path)

    groups = ordered_groups(set(grouped.keys()))

    lines: list[str] = []
    lines.append("# Master Guidance Book")
    lines.append("")
    lines.append(
        "Consolidated guidance from `docs/guides`, organized by related topics first and then all remaining documents."
    )
    lines.append("")
    lines.append(f"_Generated on {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} via `scripts/generate-master-guidance-book.py`._")
    lines.append("")
    lines.append("## Table of Contents")
    lines.append("")
    lines.append("### Inventory")
    lines.append("- [Complete Source Inventory](#complete-source-inventory)")
    lines.append("- [Consolidated Guidance](#consolidated-guidance)")
    lines.append("")

    for group in groups:
        group_title = titleize_group(group)
        group_anchor = slugify(f"{group_title} guidance")
        lines.append(f"- [{group_title} Guidance](#{group_anchor})")
        for file_path in grouped[group]:
            rel = file_path.relative_to(GUIDES_DIR).as_posix()
            doc_title = file_path.stem.replace("-", " ").title()
            doc_anchor = slugify(f"{doc_title} {rel}")
            lines.append(f"  - [{doc_title} (`{rel}`)](#{doc_anchor})")

    lines.append("")
    lines.append("## Complete Source Inventory")
    lines.append("")
    for group in groups:
        lines.append(f"### {titleize_group(group)}")
        lines.append("")
        for file_path in grouped[group]:
            rel = file_path.relative_to(GUIDES_DIR).as_posix()
            lines.append(f"- `{rel}`")
        lines.append("")

    lines.append("## Consolidated Guidance")
    lines.append("")

    for group in groups:
        group_title = titleize_group(group)
        lines.append(f"### {group_title} Guidance")
        lines.append("")
        for file_path in grouped[group]:
            rel = file_path.relative_to(GUIDES_DIR).as_posix()
            doc_title = file_path.stem.replace("-", " ").title()
            lines.append(f"#### {doc_title} {rel}")
            lines.append("")
            lines.append(f"_Source: `{rel}`_")
            lines.append("")
            content = file_path.read_text(encoding="utf-8")
            lines.append(normalize_headings(content))
            lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    files = discover_files()
    book = build_book(files)
    OUTPUT_FILE.write_text(book, encoding="utf-8")
    print(f"Wrote {OUTPUT_FILE.relative_to(REPO_ROOT)} with {len(files)} source files.")


if __name__ == "__main__":
    main()
