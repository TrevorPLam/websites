/** @type {import('@lhci/cli/src/lighthouserc.js').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      url: [
        process.env.LHCI_BASE_URL ?? 'http://localhost:3000',
        `${process.env.LHCI_BASE_URL ?? 'http://localhost:3000'}/blog`,
        `${process.env.LHCI_BASE_URL ?? 'http://localhost:3000'}/contact`,
      ],
      numberOfRuns: 3,
      settings: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median-run' }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200, aggregationMethod: 'median-run' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'median-run' }],
        'total-blocking-time': ['error', { maxNumericValue: 300, aggregationMethod: 'median-run' }],
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 400000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 1000000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
