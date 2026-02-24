// packages/multi-tenant/src/generate-dns-instructions.ts
export function generateDNSInstructions(customDomain: string): string {
  return `
## DNS Setup for ${customDomain}

Add the following DNS record at your domain registrar:
`;
}
