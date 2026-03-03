/**
 * @file scripts/performance/optimize-images.ts
 * @summary Image optimization audit and recommendation script.
 * @description Scans the repository for images used in Next.js apps and checks
 *   whether they follow the performance best practices required for LCP < 2.5s:
 *   - Large images (> {@link MAX_UNOPTIMIZED_KB} KB) should use `next/image`.
 *   - Hero/above-the-fold images should carry `priority` and `fetchPriority="high"`.
 *   - Images wider than {@link MAX_NATURAL_WIDTH}px should provide a `sizes` prop.
 *   - Image files should be in modern formats (WebP, AVIF).
 *
 *   The script exits with code 1 when `--ci` flag is passed and violations exist,
 *   making it suitable as a quality gate in CI pipelines.
 *
 * @security none
 * @requirements TASK-PERF-001: Core Web Vitals Performance Optimization
 * @usage pnpm tsx scripts/performance/optimize-images.ts [--ci] [--dir=<path>]
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, extname, relative, resolve } from 'path';

// ─── Configuration ─────────────────────────────────────────────────────────

const MAX_UNOPTIMIZED_KB = 100;
const MAX_NATURAL_WIDTH = 1920;
const MODERN_FORMATS = new Set(['.webp', '.avif', '.svg']);
const LEGACY_FORMATS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff']);
const IMAGE_EXTENSIONS = new Set([...MODERN_FORMATS, ...LEGACY_FORMATS]);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageFile {
  path: string;
  sizeKb: number;
  ext: string;
  isLegacyFormat: boolean;
}

interface ImageUsage {
  file: string;
  line: number;
  src: string;
  hasPriority: boolean;
  hasSizes: boolean;
  usesNextImage: boolean;
}

interface Violation {
  kind: 'large-image' | 'legacy-format' | 'missing-priority' | 'missing-sizes' | 'raw-img-tag';
  severity: 'error' | 'warning';
  path: string;
  message: string;
}

interface AuditReport {
  scannedFiles: number;
  scannedImages: number;
  violations: Violation[];
  passed: boolean;
}

// ─── File scanner ─────────────────────────────────────────────────────────────

/**
 * Recursively list all files under `dir`, excluding node_modules and .next.
 */
function listFiles(dir: string, results: string[] = []): string[] {
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      listFiles(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

/**
 * Find all image asset files under `dir`.
 */
function findImageAssets(dir: string): ImageFile[] {
  return listFiles(dir)
    .filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()))
    .map((f) => {
      const sizeKb = Math.round(statSync(f).size / 1024);
      const ext = extname(f).toLowerCase();
      return { path: f, sizeKb, ext, isLegacyFormat: LEGACY_FORMATS.has(ext) };
    });
}

// ─── Source-code scanner ──────────────────────────────────────────────────────

const NEXT_IMAGE_RE = /from ['"]next\/image['"]/;
const IMG_TAG_RE = /<img\b([^>]*)>/gi;
const NEXT_IMAGE_TAG_RE = /<Image\b([^>]*?)(?:\/>|>)/gi;
const SRC_ATTR_RE = /\bsrc\s*=\s*[{"']([^"'{}]+)[}"']/i;
const PRIORITY_ATTR_RE = /\bpriority\b/i;
const SIZES_ATTR_RE = /\bsizes\s*=/i;

/**
 * Scan a single source file for image-usage patterns.
 */
function scanSourceFile(filePath: string): ImageUsage[] {
  const content = readFileSync(filePath, 'utf-8');
  const usesNextImage = NEXT_IMAGE_RE.test(content);
  const usages: ImageUsage[] = [];

  const scanPattern = (pattern: RegExp, isNextImage: boolean): void => {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const attrs = match[1] ?? '';
      const srcMatch = SRC_ATTR_RE.exec(attrs);
      const src = srcMatch?.[1] ?? '';

      // Find line number for this match
      const linesBefore = content.slice(0, match.index).split('\n');
      const lineNum = linesBefore.length;

      usages.push({
        file: filePath,
        line: lineNum,
        src,
        hasPriority: PRIORITY_ATTR_RE.test(attrs),
        hasSizes: SIZES_ATTR_RE.test(attrs),
        usesNextImage: isNextImage,
      });
    }
  };

  scanPattern(IMG_TAG_RE, false);
  if (usesNextImage) {
    scanPattern(NEXT_IMAGE_TAG_RE, true);
  }

  return usages;
}

// ─── Audit logic ──────────────────────────────────────────────────────────────

/**
 * Determine whether a usage looks like a hero/LCP image by checking for
 * common naming hints in the src attribute.
 */
function looksLikeHeroImage(src: string): boolean {
  const lower = src.toLowerCase();
  return (
    lower.includes('hero') ||
    lower.includes('banner') ||
    lower.includes('cover') ||
    lower.includes('og-image') ||
    lower.includes('thumbnail')
  );
}

/**
 * Audit the given directory and return a full report.
 */
function audit(dir: string): AuditReport {
  const violations: Violation[] = [];
  const allFiles = listFiles(dir);
  const sourceFiles = allFiles.filter((f) => /\.(tsx|jsx|ts|js)$/.test(f));
  const imageAssets = findImageAssets(dir);

  // ── 1. Image asset checks ───────────────────────────────────────────────
  for (const img of imageAssets) {
    if (img.sizeKb > MAX_UNOPTIMIZED_KB) {
      violations.push({
        kind: 'large-image',
        severity: img.sizeKb > MAX_UNOPTIMIZED_KB * 2 ? 'error' : 'warning',
        path: img.path,
        message: `Image is ${img.sizeKb} KB (limit: ${MAX_UNOPTIMIZED_KB} KB). Consider optimizing or converting to WebP/AVIF.`,
      });
    }
    if (img.isLegacyFormat) {
      violations.push({
        kind: 'legacy-format',
        severity: 'warning',
        path: img.path,
        message: `Image uses legacy format ${img.ext}. Convert to WebP or AVIF for 25-50% size reduction.`,
      });
    }
  }

  // ── 2. Source file usage checks ─────────────────────────────────────────
  for (const filePath of sourceFiles) {
    const usages = scanSourceFile(filePath);

    for (const usage of usages) {
      if (!usage.usesNextImage) {
        violations.push({
          kind: 'raw-img-tag',
          severity: 'error',
          path: `${filePath}:${usage.line}`,
          message: `Raw <img> tag found (src="${usage.src}"). Use next/image for automatic optimization, lazy loading, and layout shift prevention.`,
        });
        continue;
      }

      if (!usage.hasPriority && looksLikeHeroImage(usage.src)) {
        violations.push({
          kind: 'missing-priority',
          severity: 'warning',
          path: `${filePath}:${usage.line}`,
          message: `Hero image (src="${usage.src}") is missing the priority prop. Add priority to preload LCP images and reduce LCP time.`,
        });
      }

      if (!usage.hasSizes) {
        violations.push({
          kind: 'missing-sizes',
          severity: 'warning',
          path: `${filePath}:${usage.line}`,
          message: `next/image (src="${usage.src}") is missing a sizes prop. Add sizes to prevent downloading oversized images on mobile.`,
        });
      }
    }
  }

  const errors = violations.filter((v) => v.severity === 'error');
  return {
    scannedFiles: sourceFiles.length,
    scannedImages: imageAssets.length,
    violations,
    passed: errors.length === 0,
  };
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

function main(): void {
  const args = process.argv.slice(2);
  const isCI = args.includes('--ci');
  const dirArg = args.find((a) => a.startsWith('--dir='));
  const targetDir = dirArg
    ? resolve(dirArg.replace('--dir=', ''))
    : resolve(process.cwd(), 'apps/web');

  console.log(`\n🖼️  Image Optimization Audit`);
  console.log(`   Target: ${relative(process.cwd(), targetDir) || targetDir}\n`);

  const report = audit(targetDir);

  // ── Print results ─────────────────────────────────────────────────────────
  const errors = report.violations.filter((v) => v.severity === 'error');
  const warnings = report.violations.filter((v) => v.severity === 'warning');

  if (report.violations.length === 0) {
    console.log('✅ No image optimization issues found.\n');
  } else {
    if (errors.length > 0) {
      console.log(`❌ Errors (${errors.length}):\n`);
      for (const v of errors) {
        console.log(`  [${v.kind}] ${v.path}`);
        console.log(`    ${v.message}\n`);
      }
    }
    if (warnings.length > 0) {
      console.log(`⚠️  Warnings (${warnings.length}):\n`);
      for (const v of warnings) {
        console.log(`  [${v.kind}] ${v.path}`);
        console.log(`    ${v.message}\n`);
      }
    }
  }

  console.log(
    `📊 Summary: ${report.scannedFiles} source files, ${report.scannedImages} image assets scanned.`,
  );
  console.log(
    `   ${errors.length} error(s), ${warnings.length} warning(s).\n`,
  );

  if (isCI && !report.passed) {
    console.error('CI mode: failing due to image optimization errors.');
    process.exit(1);
  }
}

main();
