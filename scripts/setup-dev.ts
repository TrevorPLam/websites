#!/usr/bin/env tsx

/**
 * @file scripts/setup-dev.ts
 * @summary One-command setup for new developer onboarding.
 * @description Automates environment bootstrap, dependency installation, and optional database initialization.
 * @security Handles environment variables and executes local system commands.
 * @adr none
 * @requirements INFRA-002
 */

import { randomBytes } from 'crypto';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';

type LogType = 'info' | 'success' | 'error' | 'warning';

function log(message: string, type: LogType = 'info'): void {
  const colors: Record<LogType, string> = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m'
  };

  console.log(`${colors[type]}${message}\x1b[0m`);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function run(command: string, stdio: 'pipe' | 'inherit' = 'pipe'): string {
  if (stdio === 'inherit') {
    execSync(command, { stdio });
    return '';
  }
}

function checkPrerequisites(): void {
  log('Checking prerequisites...', 'info');

  const nodeVersion = run('node --version');
  const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0], 10);

  if (majorVersion < 22) {
    throw new Error(`Node.js 22+ required. Found: ${nodeVersion}`);
  }

  log(`✓ Node.js ${nodeVersion}`, 'success');

  try {
    const pnpmVersion = run('pnpm --version');
    log(`✓ pnpm ${pnpmVersion}`, 'success');
  } catch {
    throw new Error('pnpm is required but not installed. Install pnpm and re-run `pnpm setup`.');
  }

  try {
    run('docker --version');
    log('✓ Docker available', 'success');
  } catch {
    log('⚠ Docker not found (optional for local development)', 'warning');
  }
}

function setupEnvironment(): void {
  log('Setting up environment...', 'info');

  if (existsSync('.env.local')) {
    log('✓ .env.local already exists', 'success');
    return;
  }

  const sourceEnvFile = existsSync('.env.example')
    ? '.env.example'
    : existsSync('.env.template')
      ? '.env.template'
      : null;

  if (sourceEnvFile) {
    log(`Creating .env.local from ${sourceEnvFile}...`, 'info');

    const generatedSecret = randomBytes(32).toString('hex');
    const envContent = readFileSync(sourceEnvFile, 'utf8').replace(
      /^NEXTAUTH_SECRET=.*$/m,
      `NEXTAUTH_SECRET=${generatedSecret}`
    );

    writeFileSync('.env.local', envContent);
    log('✓ .env.local created', 'success');
    return;
  }

  log('⚠ No .env.example or .env.template found. Creating minimal .env.local...', 'warning');

  const minimalEnv = `# Development Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=${randomBytes(32).toString('hex')}
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
`;

  writeFileSync('.env.local', minimalEnv);
  log('✓ Minimal .env.local created', 'success');
}

function installDependencies(): void {
  log('Installing dependencies...', 'info');
  run('pnpm install', 'inherit');
  log('✓ Dependencies installed', 'success');
}

function setupDatabase(): void {
  if (process.env.SKIP_DB_SETUP === '1') {
    log('⚠ SKIP_DB_SETUP=1 set. Skipping database setup.', 'warning');
    return;
  }

  log('Setting up database...', 'info');

  try {
    run('supabase --version');
    log('✓ Supabase CLI available', 'success');
  } catch {
    log('⚠ Supabase CLI not available. Skipping database setup.', 'warning');
    log('Install CLI if needed: npm install -g supabase', 'info');
    return;
  }

  try {
    run('supabase status');
    log('✓ Supabase already running', 'success');
  } catch {
    log('Starting local Supabase...', 'info');
    run('supabase start', 'inherit');
    log('✓ Supabase started', 'success');
  }

  log('Running database reset/migrations...', 'info');
  run('supabase db reset', 'inherit');
  log('✓ Database migrations completed', 'success');
}

function validateEnvironment(): void {
  if (process.env.SKIP_VERIFY === '1') {
    log('⚠ SKIP_VERIFY=1 set. Skipping verification checks.', 'warning');
    return;
  }

  log('Running environment verification...', 'info');

  try {
    run('pnpm verify', 'inherit');
    log('✓ Verification passed', 'success');
  } catch {
    log('⚠ Verification reported issues. Review output above.', 'warning');
  }
}

function showNextSteps(): void {
  log('\n🎉 Setup completed.', 'success');
  log('Next steps:', 'info');
  log('1. Configure any required values in .env.local', 'info');
  log('2. Run `pnpm verify` for pre-flight checks', 'info');
  log('3. Run `pnpm dev` to start development servers', 'info');
}

function main(): void {
  log('🚀 Marketing Websites Platform - Developer Setup', 'info');
  log('Target: 5-minute clone-to-running experience\n', 'info');

  try {
    checkPrerequisites();
    setupEnvironment();
    installDependencies();
    setupDatabase();
    validateEnvironment();
    showNextSteps();
    process.exit(0);
  } catch (error) {
    log(`\n❌ Setup failed: ${errorMessage(error)}`, 'error');
    log('\nTroubleshooting:', 'info');
    log('1. Ensure Node.js 22+ is installed', 'info');
    log('2. Ensure pnpm is installed and reachable in this network', 'info');
    log('3. Confirm .env.local contains required values', 'info');
    log('4. Re-run with SKIP_DB_SETUP=1 if Supabase is unavailable', 'info');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
