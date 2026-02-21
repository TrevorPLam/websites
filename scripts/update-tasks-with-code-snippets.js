#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Research-based code snippet templates
const CODE_SNIPPETS = {
  // Core patterns that apply to most UI tasks
  'R-MARKETING': `### R-MARKETING — Section with composition
\`\`\`typescript
interface SectionProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}
export function Section({ title, description, children }: SectionProps) {
  return (
    <section>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}
\`\`\``,

  'R-UI': `### R-UI — React 19 component with ref forwarding
\`\`\`typescript
import * as React from 'react';
import { cn } from '@repo/utils';

export function Component({ ref, className, ...props }: ComponentProps) {
  return (
    <Primitive.Root
      ref={ref}
      className={cn('component', className)}
      {...props}
    />
  );
}
\`\`\``,

  ComponentRef: `### ComponentRef type for type-safe ref forwarding
\`\`\`typescript
type ComponentRef = React.ComponentRef<typeof Primitive.Root>;
\`\`\``,

  'R-A11Y': `### R-A11Y — Touch targets and reduced motion
\`\`\`css
.component-button {
  min-width: 24px;
  min-height: 24px;
}
\`\`\`

### Reduced motion detection
\`\`\`typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
\`\`\``,

  'R-PERF': `### R-PERF — LCP optimization
- Page shell < 250 KB gzipped; component-level budgets (e.g. section < 40 KB)
- LCP < 2.5s, INP ≤ 200 ms, CLS < 0.1
- Track via Lighthouse CI / next.config performanceBudgets`,

  'R-RADIX': `### R-RADIX — Primitive wrapper pattern
\`\`\`typescript
import * as Primitive from '@radix-ui/react-primitive';
import { cn } from '@repo/utils';

const ComponentRoot = React.forwardRef<
  React.ComponentRef<typeof Primitive.Root>,
  React.ComponentPropsWithoutRef<typeof Primitive.Root> & { className?: string }
>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn('component-root', className)} {...props} />
));
\`\`\``,

  // Form-specific patterns
  'R-FORM': `### R-FORM — Form with Zod resolver
\`\`\`typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { name: '', email: '' },
});
\`\`\``,

  // CMS-specific patterns
  'R-CMS': `### R-CMS — Content adapters and pagination
\`\`\`typescript
interface ContentItem {
  id: string;
  title: string;
  slug: string;
  publishDate: string;
  author?: Author;
  categories?: Category[];
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
\`\`\``,

  // Industry-specific patterns
  'R-INDUSTRY': `### R-INDUSTRY — JSON-LD schema integration
\`\`\`typescript
interface StructuredData {
  '@context': 'https://schema.org';
  '@type': 'Organization' | 'Product' | 'Article' | 'LocalBusiness';
  name: string;
  description?: string;
  url?: string;
}
\`\`\``,

  // Integration patterns
  'R-INTEGRATION': `### R-INTEGRATION — Third-party service adapter
\`\`\`typescript
interface ServiceAdapter {
  name: string;
  connect: () => Promise<void>;
  send: (data: any) => Promise<any>;
  disconnect: () => void;
}
\`\`\``,

  // Search AI patterns
  'R-SEARCH-AI': `### R-SEARCH-AI — Semantic search integration
\`\`\`typescript
interface SearchConfig {
  apiKey: string;
  endpoint: string;
  embeddingModel: string;
  rerank?: boolean;
}

export function useSemanticSearch(query: string, config: SearchConfig) {
  // Semantic search implementation
}
\`\`\``,

  // E-commerce patterns
  'R-E-COMMERCE': `### R-E-COMMERCE — Product catalog integration
\`\`\`typescript
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  variants?: ProductVariant[];
  inventory?: number;
}

interface CartItem extends Product {
  quantity: number;
}
\`\`\``,

  // Workflow patterns
  'R-WORKFLOW': `### R-WORKFLOW — Durable workflow integration
\`\`\`typescript
interface WorkflowStep {
  id: string;
  name: string;
  execute: (input: any) => Promise<any>;
  retryPolicy?: RetryPolicy;
}

interface WorkflowConfig {
  steps: WorkflowStep[];
  timeout?: number;
  retries?: number;
}
\`\`\``,

  // Monitoring patterns
  'R-MONITORING': `### R-MONITORING — Performance tracking
\`\`\`typescript
interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  inp: number; // Interaction to Next Paint
  cls: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
}

export function usePerformanceTracking() {
  // Performance monitoring implementation
}
\`\`\``,
};

// Task-specific research topic mappings
const TASK_RESEARCH_TOPICS = {
  // Component building tasks (2-1 through 2-15)
  '2-1': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-2': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX', 'R-FORM'],
  '2-3': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-4': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-5': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-6': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-7': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-8': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-9': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-10': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX', 'R-FORM'],
  '2-11': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-12': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-13': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX', 'R-CMS'],
  '2-14': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-15': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],

  // Feature creation tasks (2-16 through 2-27)
  '2-16': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-17': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-18': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-19': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-20': ['R-SEARCH-AI', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-21': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-22': ['R-INTEGRATION', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-23': ['R-MONITORING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-24': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-25': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-26': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-27': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],

  // Advanced feature tasks (2-28 through 2-47)
  '2-28': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX', 'R-FORM'],
  '2-29': ['R-E-COMMERCE', 'R-UI', 'R-A11Y', 'R-PERF', 'R-RADIX'],
  '2-30': ['R-CMS', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-31': ['R-FORM', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-32': ['R-E-COMMERCE', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-33': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-34': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-35': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-36': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-37': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-38': ['R-MONITORING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-39': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-40': ['R-MONITORING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-41': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-42': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-43': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-44': ['R-WORKFLOW', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-45': ['R-INTEGRATION', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-46': ['R-WORKFLOW', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-47': ['R-MONITORING', 'R-UI', 'R-A11Y', 'R-PERF'],

  // Industry-specific tasks (2-48 through 2-62)
  '2-48': ['R-INDUSTRY', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-49': ['R-INDUSTRY', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-50': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-51': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-52': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-53': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-54': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-55': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-56': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-57': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-58': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-59': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-60': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-61': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
  '2-62': ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'],
};

function extractTaskId(filename) {
  const match = filename.match(/(\d+-\d+)/);
  return match ? match[1] : null;
}

function generateCodeSnippets(taskId) {
  const topics = TASK_RESEARCH_TOPICS[taskId] || ['R-MARKETING', 'R-UI', 'R-A11Y', 'R-PERF'];

  let snippets = '';
  topics.forEach((topic) => {
    if (CODE_SNIPPETS[topic]) {
      snippets += CODE_SNIPPETS[topic] + '\n\n';
    }
  });

  return snippets.trim();
}

function updateTaskFile(filePath) {
  const filename = path.basename(filePath);
  const taskId = extractTaskId(filename);

  if (!taskId) {
    console.log(`Skipping ${filename} - no task ID found`);
    return;
  }

  // Skip already updated tasks (2-1 through 2-13)
  const taskNumber = parseInt(taskId.split('-')[1]);
  if (taskNumber <= 13) {
    console.log(`Skipping ${filename} - already updated`);
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if already has code snippets
    if (content.includes('## Code Snippets / Examples') && content.includes('R-MARKETING —')) {
      console.log(`Skipping ${filename} - already has code snippets`);
      return;
    }

    // Find the Code Snippets section
    const codeSnippetsStart = content.indexOf('## Code Snippets / Examples');
    const relatedPatternsStart = content.indexOf('### Related Patterns');

    if (codeSnippetsStart === -1) {
      console.log(`No Code Snippets section found in ${filename}`);
      return;
    }

    // Generate new code snippets
    const newSnippets = generateCodeSnippets(taskId);

    // Replace the old content
    let newContent;
    if (relatedPatternsStart !== -1) {
      // Replace from Code Snippets to Related Patterns
      newContent =
        content.substring(0, codeSnippetsStart) +
        '## Code Snippets / Examples\n\n' +
        newSnippets +
        '\n\n' +
        content.substring(relatedPatternsStart);
    } else {
      // Replace from Code Snippets to end
      newContent =
        content.substring(0, codeSnippetsStart) + '## Code Snippets / Examples\n\n' + newSnippets;
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filename} with code snippets`);
  } catch (error) {
    console.error(`Error updating ${filename}:`, error.message);
  }
}

function main() {
  const tasksDir = path.join(__dirname, '..', 'tasks');

  // Find all 2- task files
  const taskFiles = fs
    .readdirSync(tasksDir)
    .filter((file) => file.startsWith('2-') && file.endsWith('.md'))
    .map((file) => path.join(tasksDir, file))
    .sort();

  console.log(`Found ${taskFiles.length} task files to process`);

  taskFiles.forEach(updateTaskFile);

  console.log('Task update complete!');
}

if (require.main === module) {
  main();
}

module.exports = { updateTaskFile, generateCodeSnippets };
