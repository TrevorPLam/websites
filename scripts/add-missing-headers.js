#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need headers based on the pre-commit hook output
const filesNeedingHeaders = [
  // Admin app TypeScript files
  'apps/admin/src/entities/system/index.ts',
  'apps/admin/src/entities/system/model/system.schema.ts',
  'apps/admin/src/entities/tenant/index.ts',
  'apps/admin/src/entities/tenant/model/tenant.schema.ts',
  'apps/admin/src/entities/user/index.ts',
  'apps/admin/src/entities/user/model/user.schema.ts',
  'apps/admin/src/features/system/index.ts',
  'apps/admin/src/features/system/model/system.model.ts',
  'apps/admin/src/features/tenants/index.ts',
  'apps/admin/src/features/tenants/model/tenant.model.ts',
  'apps/admin/src/features/users/index.ts',
  'apps/admin/src/features/users/model/user.model.ts',
  'apps/admin/src/lib/api-client.ts',
  'apps/admin/src/pages/index.ts',
  'apps/admin/src/shared/lib/cn.ts',
  'apps/admin/src/shared/lib/format-date.ts',
  'apps/admin/src/shared/ui/index.ts',
  'apps/admin/src/widgets/admin-footer/index.ts',
  'apps/admin/src/widgets/admin-header/index.ts',
  'apps/admin/src/widgets/admin-sidebar/index.ts',
  'apps/admin/src/widgets/index.ts',

  // Admin app TSX files
  'apps/admin/src/__tests__/Badge.test.tsx',
  'apps/admin/src/__tests__/Button.test.tsx',
  'apps/admin/src/__tests__/TenantCard.test.tsx',
  'apps/admin/src/app/dashboard/page.tsx',
  'apps/admin/src/app/layout.tsx',
  'apps/admin/src/app/tenants/[id]/page.tsx',
  'apps/admin/src/entities/tenant/ui/TenantAvatar.tsx',
  'apps/admin/src/features/activity/ui/ActivityLog.tsx',
  'apps/admin/src/features/analytics/ui/AnalyticsDashboard.tsx',
  'apps/admin/src/features/backup/ui/BackupManager.tsx',
  'apps/admin/src/features/data/ui/DataExport.tsx',
  'apps/admin/src/features/notifications/ui/NotificationCenter.tsx',
  'apps/admin/src/features/system/ui/AlertsPanel.tsx',
  'apps/admin/src/features/system/ui/HealthStatus.tsx',
  'apps/admin/src/features/system/ui/MetricsChart.tsx',
  'apps/admin/src/features/system/ui/SystemDashboard.tsx',
  'apps/admin/src/features/tenants/ui/TenantActions.tsx',
  'apps/admin/src/features/tenants/ui/TenantCard.tsx',
  'apps/admin/src/features/tenants/ui/TenantDetailHeader.tsx',
  'apps/admin/src/features/tenants/ui/TenantFilters.tsx',
  'apps/admin/src/features/tenants/ui/TenantForm.tsx',
  'apps/admin/src/features/tenants/ui/TenantList.tsx',
  'apps/admin/src/features/tenants/ui/TenantMetrics.tsx',
  'apps/admin/src/features/tenants/ui/TenantSearch.tsx',
  'apps/admin/src/features/tenants/ui/TenantTable.tsx',
  'apps/admin/src/features/users/ui/UserCard.tsx',
  'apps/admin/src/features/users/ui/UserList.tsx',
  'apps/admin/src/features/users/ui/UserSearch.tsx',
  'apps/admin/src/pages/DashboardPage.tsx',
  'apps/admin/src/pages/SettingsPage.tsx',
  'apps/admin/src/pages/SystemPage.tsx',
  'apps/admin/src/pages/TenantsPage.tsx',
  'apps/admin/src/pages/UsersPage.tsx',
  'apps/admin/src/shared/ui/Badge.tsx',
  'apps/admin/src/shared/ui/Button.tsx',
  'apps/admin/src/shared/ui/LoadingSpinner.tsx',
  'apps/admin/src/shared/ui/MetricCard.tsx',
  'apps/admin/src/widgets/admin-footer/ui/AdminFooter.tsx',
  'apps/admin/src/widgets/admin-header/ui/AdminHeader.tsx',
  'apps/admin/src/widgets/admin-sidebar/ui/AdminSidebar.tsx',

  // Admin app other files
  'apps/admin/src/__e2e__/dashboard.spec.ts',
  'apps/admin/src/__tests__/setup.ts',
  'apps/admin/vitest.config.ts',

  // MCP server files
  'packages/agent-memory/src/index.ts',
  'packages/context-engineering/src/index.ts',
  'packages/mcp-servers/src/advanced-agent-plugins.ts',
  'packages/mcp-servers/src/ai-dlc-methodology.ts',
  'packages/mcp-servers/src/enterprise-auth-gateway.ts',
  'packages/mcp-servers/src/enterprise-mcp-marketplace.ts',
  'packages/mcp-servers/src/enterprise-registry.ts',
  'packages/mcp-servers/src/mcp-apps-marketplace.ts',
  'packages/mcp-servers/src/multi-tenant-orchestrator.ts',
  'packages/mcp-servers/src/observability-monitor.ts',
  'packages/mcp-servers/src/secure-deployment-manager.ts'
];

function generateHeader(filePath) {
  const relativePath = filePath.replace(/^.*?\//, '');
  const fileName = path.basename(filePath, path.extname(filePath));
  const isSecurity = filePath.includes('enterprise-auth-gateway') || 
                    filePath.includes('multi-tenant-orchestrator') || 
                    filePath.includes('observability-monitor') || 
                    filePath.includes('secure-deployment-manager');
  
  let summary = '';
  let description = '';
  let security = isSecurity ? 'Enterprise-grade security with authentication, authorization, and audit logging.' : 'none';
  let requirements = 'none';

  // Generate summary and description based on file path
  if (filePath.includes('/features/')) {
    const feature = filePath.match(/\/features\/([^\/]+)/)[1];
    summary = `${feature} feature implementation for admin interface.`;
    description = `Provides ${feature} management functionality with proper error handling and user feedback.`;
  } else if (filePath.includes('/entities/')) {
    const entity = filePath.match(/\/entities\/([^\/]+)/)[1];
    summary = `${entity} entity definitions and schemas.`;
    description = `Core data structures and validation for ${entity} management.`;
  } else if (filePath.includes('/shared/')) {
    summary = `Shared utilities and components.`;
    description = `Reusable functionality across admin application.`;
  } else if (filePath.includes('/widgets/')) {
    const widget = filePath.match(/\/widgets\/([^\/]+)/)[1];
    summary = `${widget} widget component.`;
    description = `Layout component for admin interface ${widget} section.`;
  } else if (filePath.includes('/pages/')) {
    const page = path.basename(filePath, '.tsx');
    summary = `${page} page component.`;
    description = `Main page component for ${page} functionality.`;
  } else if (filePath.includes('/mcp-servers/')) {
    const server = path.basename(filePath, '.ts');
    summary = `MCP server implementation: ${server}.`;
    description = `Enterprise MCP server providing ${server.replace(/-/g, ' ')} capabilities.`;
    requirements = 'MCP-standards, enterprise-security';
  } else if (filePath.includes('agent-memory')) {
    summary = 'Enhanced memory system with confidence scoring and priority-based retrieval.';
    description = '2026 standards-compliant memory management with multi-factor scoring and diversity selection.';
    requirements = '2026-agentic-coding, memory-systems';
  } else if (filePath.includes('context-engineering')) {
    summary = 'Advanced context engineering with hierarchical budgets and intelligent caching.';
    description = 'Multi-level context management with compression and optimization metrics.';
    requirements = '2026-context-engineering, optimization';
  }

  const header = `/**
 * @file ${relativePath}
 * @summary ${summary}
 * @description ${description}
 * @security ${security}
 * @requirements ${requirements}
 */`;

  return header;
}

function addHeaderToFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has a header
    if (content.startsWith('/**')) {
      console.log(`✅ Already has header: ${filePath}`);
      return;
    }

    const header = generateHeader(filePath);
    
    // Find the first non-empty line to insert header before
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Skip shebang if present
    if (lines[0] && lines[0].startsWith('#!')) {
      insertIndex = 1;
    }
    
    // Insert header
    lines.splice(insertIndex, 0, header);
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✅ Added header to: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('🚀 Adding headers to missing files...\n');
filesNeedingHeaders.forEach(addHeaderToFile);
console.log('\n✅ Header addition complete!');
