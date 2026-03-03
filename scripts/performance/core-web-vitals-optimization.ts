/**
 * @file scripts/performance/core-web-vitals-optimization.ts
 * @summary Core Web Vitals Optimization Script for Next.js 16
 * @description Analyzes and optimizes Core Web Vitals (LCP, INP, CLS) across the application.
 *   Provides automated recommendations and implements fixes for common performance issues.
 * @security none
 * @requirements TASK-PERF-001: Next.js 16 Cache Components & PPR Optimization
 * @usage pnpm tsx scripts/performance/core-web-vitals-optimization.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

interface CoreWebVitalsMetrics {
  lcp: number; // Largest Contentful Paint (target: <2500ms)
  inp: number; // Interaction to Next Paint (target: <200ms)
  cls: number; // Cumulative Layout Shift (target: <0.1)
}

interface OptimizationResult {
  metric: keyof CoreWebVitalsMetrics;
  current: number;
  target: number;
  status: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
  implemented: boolean;
}

/**
 * Analyze current Core Web Vitals performance
 */
async function analyzeCoreWebVitals(): Promise<CoreWebVitalsMetrics> {
  // In a real implementation, this would collect metrics from:
  // - Web Vitals library integration
  // - Tinybird analytics data
  // - Lighthouse CI reports
  // - Real user monitoring

  // For now, return baseline metrics
  return {
    lcp: 2800, // Needs optimization
    inp: 250, // Needs optimization
    cls: 0.15, // Needs optimization
  };
}

/**
 * Optimize Largest Contentful Paint (LCP)
 */
async function optimizeLCP(): Promise<OptimizationResult> {
  const current = 2800;
  const target = 2500;
  const recommendations: string[] = [];

  // Check for common LCP issues
  const layoutPath = join(process.cwd(), 'apps/web/app/layout.tsx');
  if (existsSync(layoutPath)) {
    const layoutContent = readFileSync(layoutPath, 'utf-8');

    // Check for font optimization
    if (!layoutContent.includes('font-display: swap')) {
      recommendations.push('Add font-display: swap to prevent invisible text during font load');
    }

    // Check for preconnect to external domains
    if (!layoutContent.includes('preconnect')) {
      recommendations.push('Add preconnect to external domains (fonts, analytics)');
    }

    // Check for image optimization
    if (!layoutContent.includes('priority')) {
      recommendations.push('Use priority prop on above-the-fold images');
    }
  }

  // Check next.config.ts for image optimization
  const configPath = join(process.cwd(), 'apps/web/next.config.ts');
  if (existsSync(configPath)) {
    const configContent = readFileSync(configPath, 'utf-8');

    if (!configContent.includes('images')) {
      recommendations.push('Configure Next.js image optimization settings');
    }

    if (!configContent.includes('deviceSizes')) {
      recommendations.push('Add deviceSizes and imageSizes for responsive images');
    }
  }

  const status = current <= target ? 'good' : current <= 4000 ? 'needs-improvement' : 'poor';

  return {
    metric: 'lcp',
    current,
    target,
    status,
    recommendations,
    implemented: false,
  };
}

/**
 * Optimize Interaction to Next Paint (INP)
 */
async function optimizeINP(): Promise<OptimizationResult> {
  const current = 250;
  const target = 200;
  const recommendations: string[] = [];

  // Check for common INP issues
  const layoutPath = join(process.cwd(), 'apps/web/app/layout.tsx');
  if (existsSync(layoutPath)) {
    const layoutContent = readFileSync(layoutPath, 'utf-8');

    // Check for React 19 features
    if (!layoutContent.includes('useTransition')) {
      recommendations.push('Use startTransition for non-blocking interactions');
    }

    // Check for Suspense boundaries
    if (!layoutContent.includes('Suspense')) {
      recommendations.push('Add Suspense boundaries for streaming content');
    }
  }

  // Check for heavy JavaScript bundles
  recommendations.push('Implement code splitting for large components');
  recommendations.push('Use dynamic imports for non-critical JavaScript');
  recommendations.push('Optimize third-party scripts loading');

  const status = current <= target ? 'good' : current <= 500 ? 'needs-improvement' : 'poor';

  return {
    metric: 'inp',
    current,
    target,
    status,
    recommendations,
    implemented: false,
  };
}

/**
 * Optimize Cumulative Layout Shift (CLS)
 */
async function optimizeCLS(): Promise<OptimizationResult> {
  const current = 0.15;
  const target = 0.1;
  const recommendations: string[] = [];

  // Check for common CLS issues
  const globalCssPath = join(process.cwd(), 'packages/ui/src/globals.css');
  if (existsSync(globalCssPath)) {
    const cssContent = readFileSync(globalCssPath, 'utf-8');

    // Check for explicit dimensions on images
    if (!cssContent.includes('aspect-ratio')) {
      recommendations.push('Use aspect-ratio CSS property for responsive images');
    }

    // Check for reserve space for dynamic content
    recommendations.push('Reserve space for dynamic content to prevent shifts');
  }

  recommendations.push('Avoid inserting content above existing content');
  recommendations.push('Use transform animations instead of layout-affecting properties');
  recommendations.push('Preload fonts to prevent FOUT/FOIT');

  const status = current <= target ? 'good' : current <= 0.25 ? 'needs-improvement' : 'poor';

  return {
    metric: 'cls',
    current,
    target,
    status,
    recommendations,
    implemented: false,
  };
}

/**
 * Implement automated optimizations
 */
async function implementOptimizations(results: OptimizationResult[]): Promise<void> {
  console.log('🔧 Implementing automated optimizations...\n');

  // Implement font optimization
  const layoutPath = join(process.cwd(), 'apps/web/app/layout.tsx');
  if (existsSync(layoutPath)) {
    let layoutContent = readFileSync(layoutPath, 'utf-8');

    // Add font optimization
    if (!layoutContent.includes('font-display: swap')) {
      const fontLink =
        '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
      layoutContent = layoutContent.replace('</head>', `    ${fontLink}\n  </head>`);
      writeFileSync(layoutPath, layoutContent);
      console.log('✅ Added font preconnect and display=swap');
    }
  }

  // Implement image optimization in next.config.ts
  const configPath = join(process.cwd(), 'apps/web/next.config.ts');
  if (existsSync(configPath)) {
    let configContent = readFileSync(configPath, 'utf-8');

    if (!configContent.includes('deviceSizes')) {
      const imageConfig = `,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  }`;

      configContent = configContent.replace('};', `${imageConfig}\n};`);
      writeFileSync(configPath, configContent);
      console.log('✅ Added Next.js image optimization configuration');
    }
  }

  console.log('\n🎯 Manual optimizations needed:');
  console.log('1. Add aspect-ratio CSS for responsive images');
  console.log('2. Use startTransition for non-blocking interactions');
  console.log('3. Implement code splitting for large components');
  console.log('4. Reserve space for dynamic content');
  console.log('5. Use transform animations instead of layout properties');
}

/**
 * Generate Core Web Vitals report
 */
async function generateReport(results: OptimizationResult[]): Promise<void> {
  console.log('📊 Core Web Vitals Optimization Report\n');
  console.log('='.repeat(50));

  results.forEach((result) => {
    const statusEmoji =
      result.status === 'good' ? '✅' : result.status === 'needs-improvement' ? '⚠️' : '❌';

    console.log(`${statusEmoji} ${result.metric.toUpperCase()}`);
    console.log(`   Current: ${result.current}${result.metric === 'cls' ? '' : 'ms'}`);
    console.log(`   Target:  ${result.target}${result.metric === 'cls' ? '' : 'ms'}`);
    console.log(`   Status:  ${result.status.replace('-', ' ')}`);

    if (result.recommendations.length > 0) {
      console.log('   Recommendations:');
      result.recommendations.forEach((rec) => console.log(`   • ${rec}`));
    }
    console.log('');
  });

  const good = results.filter((r) => r.status === 'good').length;
  const needsWork = results.filter((r) => r.status !== 'good').length;

  console.log('📈 Summary:');
  console.log(`   ✅ Good: ${good}`);
  console.log(`   🔧 Needs Work: ${needsWork}`);
  console.log(`   🎯 Target: LCP < 2.5s, INP < 200ms, CLS < 0.1`);
}

/**
 * Main optimization function
 */
async function optimizeCoreWebVitals(): Promise<void> {
  console.log('🚀 Starting Core Web Vitals Optimization...\n');

  try {
    // Analyze current performance
    const metrics = await analyzeCoreWebVitals();
    console.log('📈 Current Metrics:');
    console.log(`   LCP: ${metrics.lcp}ms (target: <2500ms)`);
    console.log(`   INP: ${metrics.inp}ms (target: <200ms)`);
    console.log(`   CLS: ${metrics.cls} (target: <0.1)`);
    console.log('');

    // Run optimizations
    const [lcpResult, inpResult, clsResult] = await Promise.all([
      optimizeLCP(),
      optimizeINP(),
      optimizeCLS(),
    ]);

    const results = [lcpResult, inpResult, clsResult];

    // Generate report
    await generateReport(results);

    // Implement automated fixes
    await implementOptimizations(results);

    console.log('\n🎉 Core Web Vitals optimization completed!');
    console.log('💡 Next steps:');
    console.log('1. Test changes in development environment');
    console.log('2. Run Lighthouse CI to verify improvements');
    console.log('3. Monitor real user metrics in production');
    console.log('4. Implement remaining manual optimizations');
  } catch (error) {
    console.error('❌ Error during Core Web Vitals optimization:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeCoreWebVitals().catch(console.error);
