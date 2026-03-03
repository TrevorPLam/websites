#!/usr/bin/env tsx

/**
 * @file scripts/verify-env.ts
 * @summary Pre-flight check for development environment validation.
 * @description Validates critical dependencies and configurations before development.
 * @security Reads environment files and local process state; no secrets are logged.
 * @adr none
 * @requirements INFRA-001
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { createServer } from 'net';

interface ValidationResult {
  success: boolean;
  message: string;
  details?: string;
}

interface CheckResult {
  name: string;
  critical: boolean;
  run: () => ValidationResult | Promise<ValidationResult>;
}

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

function run(command: string): string {
  return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function checkNodeVersion(): ValidationResult {
  try {
    const nodeVersion = run('node --version');
    const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0], 10);

    if (majorVersion < 22) {
      return {
        success: false,
        message: `Node.js 22+ required. Found: ${nodeVersion}`,
        details: 'Install Node.js 22 LTS or later'
      };
    }

    return {
      success: true,
      message: `Node.js ${nodeVersion}`,
      details: '✓ Version compatible'
    };
  } catch {
    return {
      success: false,
      message: 'Node.js not found',
      details: 'Install Node.js 22 LTS or later'
    };
  }
}

function checkPnpm(): ValidationResult {
  try {
    const pnpmVersion = run('pnpm --version');
    return {
      success: true,
      message: `pnpm ${pnpmVersion}`,
      details: '✓ Package manager available'
    };
  } catch {
    return {
      success: false,
      message: 'pnpm not found',
      details: 'Install pnpm and re-run verification'
    };
  }
}

function checkEnvironmentFile(): ValidationResult {
  const envFile = '.env.local';

  if (!existsSync(envFile)) {
    return {
      success: false,
      message: 'Environment file missing',
      details: 'Run: pnpm setup to create .env.local'
    };
  }

  try {
    const envContent = readFileSync(envFile, 'utf8');
    const lines = envContent.split('\n').filter((line) => line.trim() && !line.startsWith('#'));

    const requiredVars = ['NEXTAUTH_SECRET', 'NEXT_PUBLIC_APP_URL', 'NEXTAUTH_URL'];
    const missingRequired = requiredVars.filter((varName) => {
      if (!envContent.includes(`${varName}=`)) {
        return true;
      }

      return envContent.includes(`${varName}=your-`) || envContent.includes(`${varName}=change-`);
    });

    const optionalVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY', 'RESEND_API_KEY'];
    const missingOptional = optionalVars.filter((varName) => {
      if (!envContent.includes(`${varName}=`)) {
        return true;
      }

      return envContent.includes(`${varName}=your-`);
    });

    if (missingRequired.length > 0) {
      return {
        success: false,
        message: 'Required environment variables missing',
        details: `Missing: ${missingRequired.join(', ')}`
      };
    }

    const details = missingOptional.length > 0
      ? `✓ ${lines.length} variables configured\n⚠ Optional placeholders: ${missingOptional.join(', ')}`
      : `✓ ${lines.length} variables configured`;

    return {
      success: true,
      message: 'Environment file valid',
      details
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: 'Failed to read environment file',
      details: reason
    };
  }
}

function checkDependencies(): ValidationResult {
  try {
    const result = run('pnpm list --depth=0');
    const lines = result.split('\n').filter((line) => line.trim());
    const packageCount = Math.max(lines.length - 2, 0);

    if (packageCount < 10) {
      return {
        success: false,
        message: 'Dependencies not properly installed',
        details: `Found ${packageCount} packages. Run: pnpm install`
      };
    }

    return {
      success: true,
      message: `${packageCount} packages installed`,
      details: '✓ Dependencies available'
    };
  } catch {
    return {
      success: false,
      message: 'Dependency check failed',
      details: 'Run: pnpm install'
    };
  }
}

function checkDatabase(): ValidationResult {
  try {
    run('supabase --version');
  } catch {
    return {
      success: false,
      message: 'Supabase CLI not found',
      details: 'Run: npm install -g supabase (optional)'
    };
  }

  try {
    const status = run('supabase status');
    if (status.includes('API URL:')) {
      return {
        success: true,
        message: 'Supabase running locally',
        details: '✓ Database available'
      };
    }

    return {
      success: false,
      message: 'Supabase status unclear',
      details: 'Run: supabase status'
    };
  } catch {
    return {
      success: false,
      message: 'Supabase not running',
      details: 'Run: supabase start (optional for local DB workflows)'
    };
  }
}

function checkTypeScript(): ValidationResult {
  try {
    run('pnpm check:types');
    return {
      success: true,
      message: 'TypeScript compilation',
      details: '✓ No type errors'
    };
  } catch {
    return {
      success: false,
      message: 'TypeScript errors found',
      details: 'Run: pnpm check:types for details'
    };
  }
}

function checkBuild(): ValidationResult {
  try {
    run('pnpm build');
    return {
      success: true,
      message: 'Build successful',
      details: '✓ Applications build correctly'
    };
  } catch {
    return {
      success: false,
      message: 'Build failed',
      details: 'Run: pnpm build for details'
    };
  }
}

function checkCriticalTests(): ValidationResult {
  try {
    run('pnpm test:coverage:critical');
    return {
      success: true,
      message: 'Critical tests passing',
      details: '✓ Core functionality verified'
    };
  } catch {
    return {
      success: false,
      message: 'Critical tests failing',
      details: 'Run: pnpm test:coverage:critical for details'
    };
  }
}

function checkGitHooks(): ValidationResult {
  const preCommitExists = existsSync('.husky/pre-commit');
  if (!preCommitExists) {
    return {
      success: false,
      message: 'Git hooks missing',
      details: 'Run: pnpm prepare to install Husky hooks'
    };
  }

  return {
    success: true,
    message: 'Git hooks configured',
    details: '✓ Husky pre-commit hook active'
  };
}

function checkPortAvailability(): Promise<ValidationResult> {
  const ports = [3000, 3001];

  const checks = ports.map((port) =>
    new Promise<number | null>((resolve) => {
      const server = createServer();

      server.once('error', () => {
        resolve(port);
      });

      server.once('listening', () => {
        server.close(() => {
          resolve(null);
        });
      });

      server.listen(port, '127.0.0.1');
    })
  );

  return Promise.all(checks).then((results) => {
    const blockedPorts = results.filter((value): value is number => value !== null);

    if (blockedPorts.length > 0) {
      return {
        success: false,
        message: `Port(s) in use: ${blockedPorts.join(', ')}`,
        details: 'Stop conflicting processes or configure alternate dev ports'
      };
    }

    return {
      success: true,
      message: 'Development ports available',
      details: `✓ Ports ${ports.join(', ')} free`
    };
  });
}

const checks: CheckResult[] = [
  { name: 'Node.js Version', critical: true, run: checkNodeVersion },
  { name: 'Package Manager', critical: true, run: checkPnpm },
  { name: 'Environment File', critical: true, run: checkEnvironmentFile },
  { name: 'Dependencies', critical: true, run: checkDependencies },
  { name: 'Database', critical: false, run: checkDatabase },
  { name: 'TypeScript', critical: true, run: checkTypeScript },
  { name: 'Build', critical: true, run: checkBuild },
  { name: 'Critical Tests', critical: true, run: checkCriticalTests },
  { name: 'Git Hooks', critical: false, run: checkGitHooks },
  { name: 'Port Availability', critical: false, run: checkPortAvailability }
];

async function main(): Promise<void> {
  log('🔍 Environment Verification', 'info');
  log('Checking development environment readiness...\n', 'info');

  const criticalTotal = checks.filter((check) => check.critical).length;
  let criticalPassed = 0;
  let allPassed = 0;

  for (const check of checks) {
    const result = await check.run();

    const icon = result.success ? '✓' : '✗';
    const status: LogType = result.success ? 'success' : 'error';
    log(`${icon} ${check.name}: ${result.message}`, status);

    if (result.details) {
      log(`   ${result.details}`, result.success ? 'info' : 'warning');
    }

    if (result.success) {
      allPassed += 1;
      if (check.critical) {
        criticalPassed += 1;
      }
    }

    console.log('');
  }

  const criticalScore = Math.round((criticalPassed / criticalTotal) * 100);
  const overallScore = Math.round((allPassed / checks.length) * 100);

  log('📊 Summary', 'info');
  log(
    `Critical checks: ${criticalPassed}/${criticalTotal} (${criticalScore}%)`,
    criticalScore === 100 ? 'success' : 'warning'
  );
  log(
    `Overall checks: ${allPassed}/${checks.length} (${overallScore}%)`,
    overallScore >= 80 ? 'success' : 'warning'
  );

  if (criticalScore === 100) {
    log('\n🎉 Environment is ready for development!', 'success');
    log('Run: pnpm dev to start development servers', 'info');
    process.exit(0);
  }

  log('\n❌ Critical issues found. Please fix them before starting development.', 'error');
  log('\nQuick fixes:', 'info');
  log('- Missing dependencies? Run: pnpm install', 'info');
  log('- Environment issues? Run: pnpm setup', 'info');
  log('- Build errors? Run: pnpm check:types and pnpm build', 'info');
  log('- Database issues? Run: supabase start (if using local Supabase)', 'info');
  process.exit(1);
}

process.on('uncaughtException', (error) => {
  log(`Uncaught error: ${error instanceof Error ? error.message : String(error)}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason instanceof Error ? reason.message : String(reason)}`, 'error');
  process.exit(1);
});

if (require.main === module) {
  void main();
}
