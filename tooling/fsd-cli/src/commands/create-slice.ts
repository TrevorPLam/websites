#!/usr/bin/env node
/**
 * @file tooling/fsd-cli/src/commands/create-slice.ts
 * @summary Generates an FSD-compliant slice with standard segment folders.
 * @description Creates ui/api/model/lib segments and index.ts export file for consistent scaffolding.
 * @security Normalizes input names and writes only within current working directory.
 * @adr none
 * @requirements Wave-0 Task-1 (FSD CLI scaffolding command)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

type Layer = 'entities' | 'features' | 'widgets' | 'pages';

interface ParsedArgs {
  layer: Layer;
  slice: string;
  dryRun: boolean;
}

const VALID_LAYERS: Layer[] = ['entities', 'features', 'widgets', 'pages'];

function parseArgs(argv: string[]): ParsedArgs {
  const [layerArg, sliceArg, ...flags] = argv;

  if (!layerArg || !sliceArg || !VALID_LAYERS.includes(layerArg as Layer)) {
    throw new Error(
      'Usage: create-slice <entities|features|widgets|pages> <slice-name> [--dry-run]'
    );
  }

  return {
    layer: layerArg as Layer,
    slice: sliceArg,
    dryRun: flags.includes('--dry-run'),
  };
}

function normalizeSliceName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function ensureDirectory(dirPath: string, dryRun: boolean): void {
  if (dryRun) {
    console.log(`[dry-run] mkdir -p ${dirPath}`);
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIndexFile(targetPath: string, dryRun: boolean): void {
  const content = "export * from './ui';\n";
  if (dryRun) {
    console.log(`[dry-run] write ${targetPath}`);
    return;
  }
  fs.writeFileSync(targetPath, content, 'utf8');
}

function writePlaceholder(segmentDir: string, dryRun: boolean): void {
  const filePath = path.join(segmentDir, '.gitkeep');
  if (dryRun) {
    console.log(`[dry-run] write ${filePath}`);
    return;
  }
  fs.writeFileSync(filePath, '', 'utf8');
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  const sliceName = normalizeSliceName(parsed.slice);

  if (!sliceName) {
    throw new Error('Slice name cannot be empty after normalization.');
  }

  const root = process.cwd();
  const sliceRoot = path.join(root, parsed.layer, sliceName);
  const segments = ['ui', 'api', 'model', 'lib'];

  ensureDirectory(sliceRoot, parsed.dryRun);
  for (const segment of segments) {
    const segmentDir = path.join(sliceRoot, segment);
    ensureDirectory(segmentDir, parsed.dryRun);
    writePlaceholder(segmentDir, parsed.dryRun);
  }

  writeIndexFile(path.join(sliceRoot, 'index.ts'), parsed.dryRun);

  console.log(
    `[create-slice] ${parsed.dryRun ? 'Planned' : 'Created'} ${parsed.layer}/${sliceName} with segments: ${segments.join(', ')}`
  );
}

main();
