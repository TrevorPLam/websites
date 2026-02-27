/**
 * @file turbo/generators/fsd-slice/generator.ts
 * Task: TASK-GEN-001 FSD Slice Generator
 * 
 * Purpose: Generate Feature-Sliced Design v2.1 compliant slices with proper @x imports
 */

import type { Generator, PlopLike } from '../config';

const FSD_LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'] as const;
const DEFAULT_LAYERS = ['shared', 'entities', 'features', 'widgets'] as const;

function isValidSliceName(value: string): true | string {
  if (!value) return 'Slice name is required.';
  if (!/^[a-z][a-z0-9]*$/.test(value)) {
    return 'Use camelCase starting with lowercase letter.';
  }
  return true;
}

function isValidLayers(value: string): true | string {
  if (!value) return 'At least one layer is required.';
  const layers = value.split(',').map(l => l.trim());
  for (const layer of layers) {
    if (!DEFAULT_LAYERS.includes(layer as any)) {
      return `Invalid layer: ${layer}. Valid layers: ${DEFAULT_LAYERS.join(', ')}`;
    }
  }
  return true;
}

export default function registerFsdSliceGenerator(plop: PlopLike): void {
  plop.setGenerator('fsd-slice', {
    description: 'Generate FSD v2.1 compliant slice with proper @x imports',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Slice name (camelCase):',
        validate: isValidSliceName,
      },
      {
        type: 'list',
        name: 'layers',
        message: 'Which layers to generate?',
        choices: DEFAULT_LAYERS,
        default: 'features',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description (optional):',
        default: '',
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test files?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withStories',
        message: 'Include Storybook stories?',
        default: false,
      },
    ],
    actions: [
      // Generate shared layer
      {
        type: 'addMany',
        destination: 'packages/shared/src/{{name}}',
        base: 'turbo/generators/fsd-slice/templates/shared',
        templateFiles: 'turbo/generators/fsd-slice/templates/shared/**',
        when: (answers) => answers?.layers?.includes('shared'),
        abortOnFail: true,
      },
      // Generate entities layer
      {
        type: 'addMany',
        destination: 'packages/entities/src/{{name}}',
        base: 'turbo/generators/fsd-slice/templates/entities',
        templateFiles: 'turbo/generators/fsd-slice/templates/entities/**',
        when: (answers) => answers?.layers?.includes('entities'),
        abortOnFail: true,
      },
      // Generate features layer
      {
        type: 'addMany',
        destination: 'packages/features/src/{{name}}',
        base: 'turbo/generators/fsd-slice/templates/features',
        templateFiles: 'turbo/generators/fsd-slice/templates/features/**',
        when: (answers) => answers?.layers?.includes('features'),
        abortOnFail: true,
      },
      // Generate widgets layer
      {
        type: 'addMany',
        destination: 'packages/widgets/src/{{name}}',
        base: 'turbo/generators/fsd-slice/templates/widgets',
        templateFiles: 'turbo/generators/fsd-slice/templates/widgets/**',
        when: (answers) => answers?.layers?.includes('widgets'),
        abortOnFail: true,
      },
      // Update package exports
      {
        type: 'modify',
        path: 'packages/shared/src/index.ts',
        pattern: /\/\/ Export generators\n/,
        template: '// Export generators\nexport * from \'./{{name}}\';\n',
        when: (answers) => answers?.layers?.includes('shared'),
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'packages/entities/src/index.ts',
        pattern: /\/\/ Export generators\n/,
        template: '// Export generators\nexport * from \'./{{name}}\';\n',
        when: (answers) => answers?.layers?.includes('entities'),
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'packages/features/src/index.ts',
        pattern: /\/\/ Export generators\n/,
        template: '// Export generators\nexport * from \'./{{name}}\';\n',
        when: (answers) => answers?.layers?.includes('features'),
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'packages/widgets/src/index.ts',
        pattern: /\/\/ Export generators\n/,
        template: '// Export generators\nexport * from \'./{{name}}\';\n',
        when: (answers) => answers?.layers?.includes('widgets'),
        abortOnFail: true,
      },
    ],
  });
}
