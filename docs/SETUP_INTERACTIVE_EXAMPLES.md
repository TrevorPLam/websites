<!--
/**
 * @file docs/SETUP_INTERACTIVE_EXAMPLES.md
 * @role docs
 * @summary Guide for setting up interactive examples and component playgrounds.
 *
 * @entrypoints
 * - Referenced from documentation plan
 * - Setup instructions
 *
 * @exports
 * - N/A
 *
 * @depends_on
 * - docs/components/ui-library.md (component docs)
 *
 * @used_by
 * - Developers setting up interactive docs
 *
 * @runtime
 * - environment: docs
 * - side_effects: none
 *
 * @data_flow
 * - inputs: setup instructions
 * - outputs: interactive documentation
 *
 * @invariants
 * - Examples must be tested and working
 * - Playground must match component API
 *
 * @gotchas
 * - Requires additional dependencies
 * - May need build configuration
 *
 * @issues
 * - N/A
 *
 * @opportunities
 * - Add more interactive features
 * - Integrate with Storybook
 *
 * @verification
 * - ✅ Steps verified against tool documentation
 *
 * @status
 * - confidence: high
 * - last_audited: 2026-02-18
 */
-->

# Setting Up Interactive Examples

**Last Updated:** 2026-02-18  
**Status:** Setup Guide  
**Related:** [Component Documentation](components/ui-library.md)

---

This guide explains how to add interactive examples, component playgrounds, and copyable code snippets to the documentation.

## Options for Interactive Documentation

### 1. Storybook Integration

**Best for:** Component playgrounds and visual testing

**Setup:**
```bash
# Install Storybook
npx storybook@latest init

# Configure for React + TypeScript
# Follow prompts
```

**Integration:**
- Link Storybook from component docs
- Embed Storybook stories in documentation
- Use Storybook's "Try it" features

### 2. CodeSandbox Integration

**Best for:** Full code examples and tutorials

**Setup:**
1. Create CodeSandbox templates
2. Add "Open in CodeSandbox" buttons
3. Link from documentation

**Example:**
```markdown
[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/your-template-id)
```

### 3. Docusaurus MDX Components

**Best for:** Embedded interactive examples in docs site

**Setup:**
Create React components for interactive examples:

```tsx
// src/components/InteractiveExample.tsx
import React, { useState } from 'react';

export function InteractiveExample() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <p>You typed: {value}</p>
    </div>
  );
}
```

Use in MDX:
```mdx
import {InteractiveExample} from '@site/src/components/InteractiveExample';

<InteractiveExample />
```

### 4. Copy-to-Clipboard Buttons

**Best for:** Code snippets

**Setup:**
Install clipboard library:
```bash
pnpm add react-copy-to-clipboard
```

Create component:
```tsx
import CopyToClipboard from 'react-copy-to-clipboard';

export function CodeBlock({ code, language }) {
  return (
    <div>
      <CopyToClipboard text={code}>
        <button>Copy</button>
      </CopyToClipboard>
      <pre><code className={language}>{code}</code></pre>
    </div>
  );
}
```

## Component Playground Setup

### Using Storybook

1. **Install Storybook:**
   ```bash
   npx storybook@latest init
   ```

2. **Configure for components:**
   ```typescript
   // .storybook/main.ts
   export default {
     stories: ['../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)'],
     addons: ['@storybook/addon-essentials'],
   };
   ```

3. **Create stories:**
   ```typescript
   // packages/ui/src/components/Button/Button.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './Button';

   const meta: Meta<typeof Button> = {
     title: 'UI/Button',
     component: Button,
   };

   export default meta;
   type Story = StoryObj<typeof Button>;

   export const Primary: Story = {
     args: {
       children: 'Click me',
     },
   };
   ```

4. **Link from docs:**
   ```markdown
   [Try Button Component →](http://localhost:6006/?path=/story/ui-button--primary)
   ```

## API Explorer Setup

### Using Swagger UI or Similar

1. **Generate OpenAPI spec** from TypeScript types
2. **Set up Swagger UI:**
   ```bash
   pnpm add swagger-ui-react
   ```
3. **Embed in documentation:**
   ```tsx
   import SwaggerUI from 'swagger-ui-react';
   import 'swagger-ui-react/swagger-ui.css';

   <SwaggerUI url="/api/openapi.json" />
   ```

## Copy-to-Clipboard Implementation

### Simple Implementation

```tsx
import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button onClick={copy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

## Integration with Documentation

### In Markdown/MDX

```mdx
import {CodeBlock} from '@site/src/components/CodeBlock';
import {InteractiveExample} from '@site/src/components/InteractiveExample';

## Example

<CodeBlock language="tsx">
{`import { Button } from '@repo/ui';

<Button>Click me</Button>`}
</CodeBlock>

## Try It

<InteractiveExample />
```

## Best Practices

- **Test all examples**: Ensure they work
- **Keep examples simple**: Focus on one concept
- **Update with code**: Sync examples with actual code
- **Provide context**: Explain what the example demonstrates
- **Make it accessible**: Ensure keyboard navigation works

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [CodeSandbox Integration](https://codesandbox.io/docs/importing)
- [Docusaurus MDX](https://docusaurus.io/docs/markdown-features/react)

---

**Note:** Choose the approach that best fits your documentation platform and needs.
