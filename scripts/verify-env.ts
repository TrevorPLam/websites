#!/usr/bin/env tsx

/**
 * @file scripts/verify-env.ts
 * @summary Pre-flight check for development environment validation.
 * @description Validates all critical dependencies and configurations before development.
 * @security Handles environment variables; no secrets exposed in logs.
 * @adr none
 * @requirements INFRA-001
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

interface ValidationResult {
  success: boolean;
  message: string;
  details?: string;
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m'
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

function checkNodeVersion(): ValidationResult {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 20) {
      return {
        success: false,
        message: `Node.js 20+ required. Found: ${nodeVersion}`,
        details: 'Please install Node.js 20 LTS or later'
      };
    }
    
    return {
      success: true,
      message: `Node.js ${nodeVersion}`,
      details: '✓ Version compatible'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Node.js not found',
      details: 'Please install Node.js 20 LTS or later'
    };
  }
}

function checkPnpm(): ValidationResult {
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    return {
      success: true,
      message: `pnpm ${pnpmVersion}`,
      details: '✓ Package manager available'
    };
  } catch (error) {
    return {
      success: false,
      message: 'pnpm not found',
      details: 'Run: npm install -g pnpm'
    };
  }
}

function checkEnvironmentFile(): ValidationResult {
  const envFile = '.env.local';
  
  if (!existsSync(envFile)) {
    return {
      success: false,
      message: 'Environment file missing',
      details: `Run: pnpm setup to create ${envFile}`
    };
  }
  
  try {
    const envContent = readFileSync(envFile, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_APP_URL',
      'NEXTAUTH_URL'
    ];
    
    const missingVars = requiredVars.filter(varName => 
      !envContent.includes(`${varName}=`) || 
      envContent.includes(`${varName}=your-`) ||
      envContent.includes(`${varName}=change-`)
    );
    
    const optionalVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'RESEND_API_KEY'
    ];
    
    const missingOptional = optionalVars.filter(varName => 
      !envContent.includes(`${varName}=`) || 
      envContent.includes(`${varName}=your-`)
    );
    
    if (missingVars.length > 0) {
      return {
        success: false,
        message: 'Required environment variables missing',
        details: `Missing: ${missingVars.join(', ')}`
      };
    }
    
    let details = `✓ ${lines.length} variables configured`;
    if (missingOptional.length > 0) {
      details += `\n⚠ Optional: ${missingOptional.join(', ')}`;
    }
    
    return {
      success: true,
      message: 'Environment file valid',
      details
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to read environment file',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function checkDependencies(): ValidationResult {
  try {
    const result = execSync('pnpm list --depth=0', { encoding: 'utf8' });
    const lines = result.split('\n').filter(line => line.trim());
    
    // Count installed packages
    const packageCount = lines.length - 2; // Subtract header and empty lines
    
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
  } catch (error) {
    return {
      success: false,
      message: 'Dependency check failed',
      details: 'Run: pnpm install'
    };
  }
}

function checkDatabase(): ValidationResult {
  try {
    // Check if Supabase CLI is available
    execSync('supabase --version', { encoding: 'utf8' });
    
    // Check if local Supabase is running
    try {
      const status = execSync('supabase status', { encoding: 'utf8' });
      if (status.includes('API URL:')) {
        return {
          success: true,
          message: 'Supabase running locally',
          details: '✓ Database available'
        };
      }
    } catch (statusError) {
      return {
        success: false,
        message: 'Supabase not running',
        details: 'Run: supabase start'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Supabase CLI not found',
      details: 'Run: npm install -g supabase'
    };
  }
}

function checkTypeScript(): ValidationResult {
  try {
    execSync('pnpm type-check', { encoding: 'utf8', stdio: 'pipe' });
    return {
      success: true,
      message: 'TypeScript compilation',
      details: '✓ No type errors'
    };
  } catch (error) {
    return {
      success: false,
      message: 'TypeScript errors found',
      details: 'Run: pnpm type-check for details'
    };
  }
}

function checkBuild(): ValidationResult {
  try {
    execSync('pnpm build', { encoding: 'utf8', stdio: 'pipe' });
    return {
      success: true,
      message: 'Build successful',
      details: '✓ Applications build correctly'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Build failed',
      details: 'Run: pnpm build for details'
    };
  }
}

function checkCriticalTests(): ValidationResult {
  try {
    execSync('pnpm test:coverage:critical', { encoding: 'utf8', stdio: 'pipe' });
    return {
      success: true,
      message: 'Critical tests passing',
      details: '✓ Core functionality verified'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Critical tests failing',
      details: 'Run: pnpm test:coverage:critical for details'
    };
  }
}

function checkGitHooks(): ValidationResult {
  try {
    const huskyInstalled = existsSync('.husky/pre-commit');
    if (huskyInstalled) {
      return {
        success: true,
        message: 'Git hooks configured',
        details: '✓ Husky pre-commit hook active'
      };
    } else {
      return {
        success: false,
        message: 'Git hooks missing',
        details: 'Run: pnpm prepare to install husky'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Git hooks check failed',
      details: 'Check husky configuration'
    };
  }
}

function checkPortAvailability(): ValidationResult {
  const ports = [3000, 3001]; // web and admin apps
  
  try {
    for (const port of ports) {
      // Simple check - try to bind to the port
      const result = execSync(`netstat -an | findstr :${port}`, { encoding: 'utf8' });
      if (result.includes(`LISTENING`)) {
        return {
          success: false,
          message: `Port ${port} in use`,
          details: 'Stop the process or use a different port'
        };
      }
    }
    
    return {
      success: true,
      message: 'Development ports available',
      details: `✓ Ports ${ports.join(', ')} free`
    };
  } catch (error) {
    // No process found on ports - they're available
    return {
      success: true,
      message: 'Development ports available',
      details: `✓ Ports ${ports.join(', ')} free`
    };
  }
}

interface CheckResult {
  name: string;
  result: ValidationResult;
  critical: boolean;
}

const checks: CheckResult[] = [
  { name: 'Node.js Version', result: checkNodeVersion(), critical: true },
  { name: 'Package Manager', result: checkPnpm(), critical: true },
  { name: 'Environment File', result: checkEnvironmentFile(), critical: true },
  { name: 'Dependencies', result: checkDependencies(), critical: true },
  { name: 'Database', result: checkDatabase(), critical: false },
  { name: 'TypeScript', result: checkTypeScript(), critical: true },
  { name: 'Build', result: checkBuild(), critical: true },
  { name: 'Critical Tests', result: checkCriticalTests(), critical: true },
  { name: 'Git Hooks', result: checkGitHooks(), critical: false },
  { name: 'Port Availability', result: checkPortAvailability(), critical: false }
];

function main() {
  log('🔍 Environment Verification', 'info');
  log('Checking development environment readiness...\n', 'info');
  
  let criticalPassed = 0;
  let criticalTotal = checks.filter(c => c.critical).length;
  let allPassed = 0;
  
  for (const check of checks) {
    const icon = check.result.success ? '✓' : '✗';
    const status = check.result.success ? 'success' : 'error';
    
    log(`${icon} ${check.name}: ${check.result.message}`, status);
    
    if (check.result.details) {
      log(`   ${check.result.details}`, check.result.success ? 'info' : 'warning');
    }
    
    if (check.result.success) {
      allPassed++;
      if (check.critical) {
        criticalPassed++;
      }
    }
    
    console.log(); // Empty line for readability
  }
  
  // Summary
  const criticalScore = Math.round((criticalPassed / criticalTotal) * 100);
  const overallScore = Math.round((allPassed / checks.length) * 100);
  
  log('📊 Summary', 'info');
  log(`Critical checks: ${criticalPassed}/${criticalTotal} (${criticalScore}%)`, 
      criticalScore === 100 ? 'success' : 'warning');
  log(`Overall checks: ${allPassed}/${checks.length} (${overallScore}%)`, 
      overallScore >= 80 ? 'success' : 'warning');
  
  if (criticalScore === 100) {
    log('\n🎉 Environment is ready for development!', 'success');
    log('Run: pnpm dev to start development servers', 'info');
    process.exit(0);
  } else {
    log('\n❌ Critical issues found. Please fix them before starting development.', 'error');
    log('\nQuick fixes:', 'info');
    log('- Missing dependencies? Run: pnpm install', 'info');
    log('- Environment issues? Run: pnpm setup', 'info');
    log('- Build errors? Check TypeScript and fix errors', 'info');
    log('- Database issues? Run: supabase start', 'info');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`Uncaught error: ${error}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled rejection at ${promise}: ${reason}`, 'error');
  process.exit(1);
});

// Run verification
if (require.main === module) {
  main();
}
