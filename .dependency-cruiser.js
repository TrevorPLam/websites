/** @type {import('dependency-cruiser').IConfiguration} */
/**
 * @file .dependency-cruiser.js
 * @summary Dependency cruiser configuration for detecting circular dependencies and import violations.
 * @description Enforces architectural rules including FSD layer isolation and import path standards.
 * @security none
 * @adr none
 * @requirements none
 */

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This module depends on a module that depends on it. Circular dependencies can cause runtime errors and make code hard to understand.',
      from: {
        pathNot: ['\\.test\\.', '\\.spec\\.', '__tests__'],
        path: '^packages'
      },
      to: {
        circular: true
      }
    },
    {
      name: 'no-self-import',
      severity: 'error',
      comment: 'This module imports itself, which is unnecessary and can cause issues.',
      from: { path: '^packages' },
      to: {
        sameFile: true
      }
    },
    {
      name: 'no-relative-import-in-packages',
      severity: 'warn',
      comment: 'In packages, prefer absolute @repo/* imports over relative imports for better maintainability.',
      from: {
        path: '^packages',
        pathNot: ['__tests__', '\\.test\\.', '\\.spec\\.']
      },
      to: {
        path: '^\\.\\.',
        pathNot: '^\\.\\./.*\\.(test|spec)\\.'
      }
    }
  ],
  options: {
    /* TypeScript configuration */
    tsConfig: {
      fileName: 'tsconfig.base.json'
    },
    moduleSystem: 'ts',
    /* Enhanced reporting */
    reporter: [
      {
        name: 'dependency-cruiser',
        options: {
          dot: {
            filter: { only: 'circular' },
            theme: {
          graph: {
            bgcolor: '#ffffff',
            fillcolor: '#f8f9fa',
            fontcolor: '#212529',
            node: {
              shape: 'box',
              style: 'rounded,filled',
              fontname: 'Arial',
              fontsize: 12,
              fillcolor: '#e3f2fd',
              fontcolor: '#1565c0'
            },
            edge: {
              color: '#6c757d',
              arrowsize: 0.8
            },
            cluster: {
              bgcolor: '#f8f9fa',
              fontcolor: '#495057'
            }
          }
        }
      }
    },
    {
      name: 'err',
      options: {
        includeRules: ['error', 'warn']
      }
    }
    ],
    /* Performance optimizations */
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'default', 'types']
    },
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'unknown'
      ]
    },
    /* Excluded patterns */
    exclude: {
      path: [
        'node_modules',
        'dist',
        'build',
        '.next',
        'coverage',
        '\\.git',
        '\\.vscode',
        '\\.idea'
      ]
    },
    /* File patterns to include */
    includeOnly: {
      path: [
        'packages/*/src/**/*.{ts,tsx,js,jsx}',
        'clients/*/src/**/*.{ts,tsx,js,jsx}',
        'tooling/*/src/**/*.{ts,tsx,js,jsx}'
      ]
    }
  }
};
