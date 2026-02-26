#!/usr/bin/env node

/**
 * @file scripts/validate-workspaces.js
 * @summary Validates pnpm workspace configuration and package consistency.
 * @description Ensures workspace packages exist and are properly configured.
 * @security Reads package.json and pnpm-workspace.yaml files only; no sensitive data processed.
 * @adr none
 * @requirements BUILD-VALIDATE-002, workspace-validation
 */

const fs = require('fs');
const path = require('path');

// Simple YAML parser for workspace packages block
function parsePnpmWorkspaces(content) {
  const lines = content.split('\n');
  const packagesStart = lines.findIndex((line) => line.trim() === 'packages:');
  if (packagesStart === -1) {
    throw new Error('Unable to find packages block in pnpm-workspace.yaml');
  }

  const packages = [];
  let indentLevel = null;

  for (let i = packagesStart + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop when we reach a line with same or less indentation than 'packages:'
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const currentIndent = line.match(/^(\s*)/)[1].length;
    if (indentLevel === null && line.trim().startsWith('-')) {
      indentLevel = currentIndent;
    } else if (indentLevel !== null && currentIndent <= indentLevel - 2) {
      break;
    }

    if (line.trim().startsWith('-')) {
      const packagePath = line
        .replace(/^\s*-\s*/, '')
        .replace(/['"]/g, '')
        .trim();
      if (packagePath) {
        packages.push(packagePath);
      }
    }
  }

  return packages;
}

function normalizeGlobs(globs) {
  return [...new Set(globs.map((g) => g.trim()).filter((g) => g))];
}

function readPackageJsonWorkspaces(rootDir) {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
}

function readPnpmWorkspaceGlobs(rootDir) {
  const pnpmPath = path.join(rootDir, 'pnpm-workspace.yaml');
  const content = fs.readFileSync(pnpmPath, 'utf8');
  return parsePnpmWorkspaces(content);
}

function diffSets(a, b) {
  const onlyA = a.filter((item) => !b.includes(item));
  const onlyB = b.filter((item) => !a.includes(item));
  return { onlyA, onlyB };
}

function main() {
  const rootDir = process.cwd();
  const pkgWorkspaces = normalizeGlobs(readPackageJsonWorkspaces(rootDir));
  const pnpmWorkspaces = normalizeGlobs(readPnpmWorkspaceGlobs(rootDir));

  const { onlyA, onlyB } = diffSets(pkgWorkspaces, pnpmWorkspaces);
  if (onlyA.length === 0 && onlyB.length === 0) {
    console.log('✔ Workspaces are in sync between package.json and pnpm-workspace.yaml');
    return;
  }

  if (onlyA.length > 0) {
    console.error('Entries only in package.json:', onlyA);
  }
  if (onlyB.length > 0) {
    console.error('Entries only in pnpm-workspace.yaml:', onlyB);
  }
  process.exit(1);
}

main();
