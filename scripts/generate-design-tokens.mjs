/**
 * @file scripts/generate-design-tokens.mjs
 * @summary Generates CSS/JSON token artifacts from centralized token definitions.
 * @security Writes local artifacts only; no external network access.
 * @requirements GAP-ADVANCED-005
 */

import { mkdir, writeFile } from 'node:fs/promises';

const designTokens = {
  color: {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    primary: '174 85% 33%',
    primaryForeground: '0 0% 100%',
    secondary: '220 20% 14%',
    secondaryForeground: '0 0% 100%',
    muted: '220 14% 92%',
    mutedForeground: '220 10% 40%',
    accent: '174 85% 93%',
    accentForeground: '174 85% 20%',
    destructive: '0 72% 38%',
    destructiveForeground: '0 0% 100%',
    border: '220 14% 88%',
    input: '220 14% 88%',
    ring: '174 85% 33%'
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  radius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', full: '9999px' }
};

const outDir = new URL('../packages/design-tokens/generated/', import.meta.url);
await mkdir(outDir, { recursive: true });

const cssVars = [':root {'];
for (const [groupName, group] of Object.entries(designTokens)) {
  for (const [token, value] of Object.entries(group)) {
    cssVars.push(`  --${groupName}-${token}: ${value};`);
  }
}
cssVars.push('}');

await writeFile(new URL('tokens.css', outDir), `${cssVars.join('\n')}\n`, 'utf8');
await writeFile(new URL('tokens.json', outDir), `${JSON.stringify(designTokens, null, 2)}\n`, 'utf8');
console.log('Generated design token artifacts at packages/design-tokens/generated');
