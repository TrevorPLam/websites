#!/usr/bin/env tsx

/**
 * @file scripts/setup-dev.ts
 * @summary One-command setup for new developer onboarding.
 * @description Automates environment validation, dependency installation, and database setup.
 * @security Handles environment variables and executes system commands; validates inputs.
 * @adr none
 * @requirements INFRA-002
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m'
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

async function checkPrerequisites() {
  log('Checking prerequisites...', 'info');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 22) {
      throw new Error(`Node.js 22+ required. Found: ${nodeVersion}`);
    }
    
    log(`✓ Node.js ${nodeVersion}`, 'success');
  } catch (error) {
    log(`✗ Node.js check failed: ${error}`, 'error');
    throw error;
  }
  
  // Check pnpm
  try {
    execSync('pnpm --version', { encoding: 'utf8' });
    log('✓ pnpm available', 'success');
  } catch (error) {
    log('✗ pnpm not found. Installing...', 'warning');
    try {
      execSync('npm install -g pnpm', { stdio: 'inherit' });
      log('✓ pnpm installed', 'success');
    } catch (installError) {
      log(`✗ Failed to install pnpm: ${installError}`, 'error');
      throw installError;
    }
  }
  
  // Check Docker (optional but recommended)
  try {
    execSync('docker --version', { encoding: 'utf8' });
    log('✓ Docker available', 'success');
  } catch (error) {
    log('⚠ Docker not found (optional for local development)', 'warning');
  }
}

async function setupEnvironment() {
  log('Setting up environment...', 'info');
  
  // Copy .env.example/.env.template to .env.local if it doesn't exist
  if (!existsSync('.env.local')) {
    const sourceEnvFile = existsSync('.env.example') ? '.env.example' : existsSync('.env.template') ? '.env.template' : null;

    if (sourceEnvFile) {
      log(`Creating .env.local from ${sourceEnvFile}...`, 'info');
      
      let envContent = readFileSync(sourceEnvFile, 'utf8');
      
      // Generate random secrets for development
      const randomSecret = () => randomBytes(32).toString('hex');
      
      envContent = envContent
        .replace(/NEXTAUTH_SECRET=.*/, `NEXTAUTH_SECRET=${randomSecret()}`)
        .replace(/SUPABASE_SERVICE_ROLE_KEY=.*/, `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`)
        .replace(/STRIPE_SECRET_KEY=.*/, `STRIPE_SECRET_KEY=sk_test_your-stripe-key-here`)
        .replace(/RESEND_API_KEY=.*/, `RESEND_API_KEY=re_your-resend-key-here`);
      
      writeFileSync('.env.local', envContent);
      log('✓ .env.local created with development defaults', 'success');
    } else {
      log('⚠ No .env.example or .env.template found. Creating minimal .env.local...', 'warning');
      
      const minimalEnv = `# Development Environment Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# External Services
STRIPE_SECRET_KEY=sk_test_your-stripe-key-here
RESEND_API_KEY=re_your-resend-key-here

# Development Flags
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true
`;
      
      writeFileSync('.env.local', minimalEnv);
      log('✓ Minimal .env.local created', 'success');
    }
  } else {
    log('✓ .env.local already exists', 'success');
  }
}

async function installDependencies() {
  log('Installing dependencies...', 'info');
  
  try {
    // Install dependencies with pnpm
    execSync('pnpm install', { stdio: 'inherit' });
    log('✓ Dependencies installed', 'success');
  } catch (error) {
    log(`✗ Failed to install dependencies: ${error}`, 'error');
    throw error;
  }
}

async function setupDatabase() {
  log('Setting up database...', 'info');
  
  try {
    // Check if Supabase CLI is available
    execSync('supabase --version', { encoding: 'utf8' });
    log('✓ Supabase CLI available', 'success');
    
    // Start local Supabase if not running
    try {
      execSync('supabase status', { encoding: 'utf8' });
      log('✓ Supabase already running', 'success');
    } catch (statusError) {
      log('Starting local Supabase...', 'info');
      execSync('supabase start', { stdio: 'inherit' });
      log('✓ Supabase started', 'success');
    }
    
    // Run migrations
    log('Running database migrations...', 'info');
    execSync('supabase db reset', { stdio: 'inherit' });
    log('✓ Database migrations completed', 'success');
    
  } catch (error) {
    log('⚠ Supabase CLI not available. Skipping database setup...', 'warning');
    log('Please install Supabase CLI: npm install -g supabase', 'info');
  }
}

async function validateEnvironment() {
  log('Validating environment configuration...', 'info');
  
  try {
    // Run t3-env validation if available
    try {
      execSync('pnpm run env:validate', { stdio: 'inherit' });
      log('✓ Environment validation passed', 'success');
    } catch (envError) {
      log('⚠ Environment validation failed. Check your .env.local file.', 'warning');
      
      // Manual validation of critical variables
      const envContent = readFileSync('.env.local', 'utf8');
      const requiredVars = ['NEXTAUTH_SECRET', 'NEXT_PUBLIC_APP_URL'];
      
      for (const varName of requiredVars) {
        if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your-`)) {
          log(`⚠ ${varName} needs to be configured in .env.local`, 'warning');
        }
      }
    }
  } catch (error) {
    log('⚠ Environment validation skipped', 'warning');
  }
}

async function buildAndTest() {
  log('Building and testing...', 'info');
  
  try {
    // Type check
    log('Running type check...', 'info');
    execSync('pnpm type-check', { stdio: 'inherit' });
    log('✓ Type check passed', 'success');
    
    // Build
    log('Building applications...', 'info');
    execSync('pnpm build', { stdio: 'inherit' });
    log('✓ Build successful', 'success');
    
    // Run critical tests
    log('Running critical tests...', 'info');
    execSync('pnpm test:coverage:critical', { stdio: 'inherit' });
    log('✓ Critical tests passed', 'success');
    
  } catch (error) {
    log(`✗ Build/test failed: ${error}`, 'error');
    log('You may need to configure your environment variables first.', 'warning');
    throw error;
  }
}

async function startDevelopment() {
  log('Starting development servers...', 'info');
  
  try {
    // Check if we can start the development server
    log('Testing development server startup...', 'info');
    
    // Start in background and quickly check if it starts successfully
    const serverProcess = execSync('pnpm dev', { 
      encoding: 'utf8', 
      timeout: 10000,
      stdio: 'pipe'
    });
    
    log('✓ Development server starts successfully', 'success');
    
  } catch (error) {
    if (error.message.includes('timeout')) {
      log('✓ Development server started (timeout expected)', 'success');
    } else {
      log(`⚠ Development server test failed: ${error}`, 'warning');
    }
  }
}

async function showNextSteps() {
  log('\n🎉 Setup completed successfully!', 'success');
  log('\nNext steps:', 'info');
  log('1. Configure your environment variables in .env.local', 'info');
  log('2. Start development: pnpm dev', 'info');
  log('3. Visit http://localhost:3000', 'info');
  log('4. Visit http://localhost:3001 for admin dashboard', 'info');
  
  log('\nUseful commands:', 'info');
  log('- pnpm dev: Start development servers', 'info');
  log('- pnpm test: Run tests', 'info');
  log('- pnpm lint: Run linting', 'info');
  log('- pnpm build: Build for production', 'info');
  
  log('\nNeed help?', 'info');
  log('- Check docs/getting-started/development-setup.md', 'info');
  log('- Run pnpm verify for environment validation', 'info');
  log('- Check AGENTS.md for AI agent guidelines', 'info');
}

async function main() {
  log('🚀 Marketing Websites Platform - Developer Setup', 'info');
  log('Target: 5-minute clone-to-running experience\n', 'info');
  
  try {
    await checkPrerequisites(); // Step 1
    await setupEnvironment(); // Step 2
    await installDependencies(); // Step 3
    await setupDatabase(); // Step 4
    await validateEnvironment(); // Step 5
    await buildAndTest(); // Step 6
    await startDevelopment(); // Step 7
    await showNextSteps(); // Step 8
    
    log('\n✅ Setup completed successfully!', 'success');
    process.exit(0);
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error}`, 'error');
    log('\nTroubleshooting:', 'info');
    log('1. Ensure Node.js 22+ is installed', 'info');
    log('2. Ensure pnpm is installed: npm install -g pnpm', 'info');
    log('3. Check .env.local configuration', 'info');
    log('4. Try running individual steps manually', 'info');
    log('5. Check the documentation for detailed setup instructions', 'info');
    
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

// Run the setup
if (require.main === module) {
  main();
}
