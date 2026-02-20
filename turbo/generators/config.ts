/**
 * @file turbo/generators/config.ts
 * Task: [6.8a] turbo gen new-client
 *
 * Purpose: Register a `new-client` generator for `turbo gen`.
 */

type Prompt = {
  type: 'input' | 'list';
  name: string;
  message: string;
  choices?: string[];
  default?: string;
  validate?: (value: string) => true | string;
};

type Action =
  | {
      type: 'addMany';
      destination: string;
      base: string;
      templateFiles: string;
      globOptions?: { dot?: boolean; ignore?: string[] };
      abortOnFail?: boolean;
    }
  | {
      type: 'modify';
      path: string;
      pattern: RegExp;
      template: string;
      abortOnFail?: boolean;
    };

type Generator = {
  description: string;
  prompts: Prompt[];
  actions: Action[];
};

type PlopLike = {
  setGenerator: (name: string, generator: Generator) => void;
};

const INDUSTRIES = [
  'salon',
  'restaurant',
  'law-firm',
  'dental',
  'medical',
  'fitness',
  'retail',
  'consulting',
  'realestate',
  'construction',
  'automotive',
  'education',
  'nonprofit',
];

function isValidClientName(value: string): true | string {
  if (!value) return 'Client name is required.';
  if (value === 'starter-template') return 'The name "starter-template" is reserved.';
  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Use kebab-case: lowercase letters, numbers, and hyphens only.';
  }
  return true;
}

export default function registerGenerators(plop: PlopLike): void {
  plop.setGenerator('new-client', {
    description: 'Scaffold a client from clients/starter-template',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Client slug (kebab-case):',
        validate: isValidClientName,
      },
      {
        type: 'list',
        name: 'industry',
        message: 'Industry:',
        choices: INDUSTRIES,
        default: 'general',
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Display name:',
        default: '{{name}}',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'clients/{{name}}',
        base: 'clients/starter-template',
        templateFiles: 'clients/starter-template/**',
        globOptions: {
          dot: true,
          ignore: [
            '**/node_modules/**',
            '**/.next/**',
            '**/.turbo/**',
            '**/dist/**',
          ],
        },
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'clients/{{name}}/package.json',
        pattern: /"name":\s*"@clients\/starter-template"/,
        template: '"name": "@clients/{{name}}"',
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'clients/{{name}}/site.config.ts',
        pattern: /id:\s*'starter-template'/,
        template: "id: '{{name}}'",
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'clients/{{name}}/site.config.ts',
        pattern: /name:\s*'Starter Template'/,
        template: "name: '{{name}}'",
        abortOnFail: true,
      },
      {
        type: 'modify',
        path: 'clients/{{name}}/site.config.ts',
        pattern: /industry:\s*'[^']*'/,
        template: "industry: '{{industry}}'",
        abortOnFail: true,
      },
    ],
  });
}
