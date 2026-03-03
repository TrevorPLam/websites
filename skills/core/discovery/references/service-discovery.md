---
name: service-discovery
description: |
  **SERVICE DISCOVERY WORKFLOW** - Automated service discovery and dependency mapping.
  USE FOR: Service inventory, dependency analysis, architecture mapping.
  DO NOT USE FOR: Simple service listing, basic monitoring.
  INVOKES: [fetch-mcp, filesystem-mcp].
meta:
  version: '1.0.0'
  author: 'agency-system'
  category: 'workflow'
---

# Service Discovery Workflow

## Overview

This Skill orchestrates comprehensive service discovery processes including service inventory, dependency mapping, architecture analysis, and service health monitoring for complex multi-service environments.

## Prerequisites

- Service registry access
- Monitoring system integration
- Network discovery tools
- Documentation sources
- Service mesh configuration

## Workflow Steps

### 1. Service Registry Analysis

**Action:** Analyze service registry for active services

**Validation:**
- Service registry connectivity confirmed
- Service endpoints discovered
- Service metadata extracted
- Health check endpoints identified
- Service versions cataloged

**MCP Server:** fetch-mcp (for registry APIs)

**Expected Output:** Complete service inventory with metadata and health endpoints

### 2. Network Service Discovery

**Action:** Discover network services and endpoints

**Validation:**
- Network scanning permissions verified
- Port scanning completed
- Service fingerprinting performed
- Protocol identification done
- Service dependencies mapped

**MCP Server:** fetch-mcp (for network discovery tools)

**Expected Output:** Network service map with protocols and dependencies

### 3. Configuration Analysis

**Action:** Analyze service configurations and dependencies

**Validation:**
- Configuration files accessed
- Environment variables extracted
- Database connections identified
- External service dependencies mapped
- API endpoints cataloged

**MCP Server:** filesystem-mcp (for configuration analysis)

**Expected Output:** Configuration analysis with dependency mapping

### 4. API Documentation Discovery

**Action:** Discover and analyze API documentation

**Validation:**
- OpenAPI/Swagger specs found
- API endpoints documented
- Authentication methods identified
- Rate limiting information extracted
- API versioning determined

**MCP Server:** fetch-mcp (for documentation APIs)

**Expected Output:** API documentation inventory with endpoint details

### 5. Service Health Assessment

**Action:** Assess health and performance of discovered services

**Validation:**
- Health check endpoints tested
- Performance metrics collected
- Error rates measured
- Response times recorded
- Availability calculated

**MCP Server:** fetch-mcp (for monitoring APIs)

**Expected Output:** Service health report with performance metrics

### 6. Dependency Mapping

**Action:** Map service dependencies and data flows

**Validation:**
- Service calls identified
- Data flow directions mapped
- Critical dependencies highlighted
- Circular dependencies detected
- Impact analysis performed

**MCP Server:** filesystem-mcp (for dependency analysis)

**Expected Output:** Dependency graph with critical path analysis

### 7. Architecture Documentation

**Action:** Generate comprehensive architecture documentation

**Validation:**
- Service inventory complete
- Dependency maps created
- Data flows documented
- Security boundaries identified
- Performance characteristics recorded

**MCP Server:** filesystem-mcp (for documentation generation)

**Expected Output:** Complete architecture documentation with visual maps

## Error Handling

| Step | Error | Recovery | Rollback? |
|------|-------|----------|-----------|
| Registry Analysis | Registry inaccessible | Use alternative discovery methods, manual inventory | No |
| Network Discovery | Network access denied | Use configuration analysis, documentation sources | No |
| Configuration Analysis | Config files inaccessible | Use runtime discovery, monitoring data | No |
| API Documentation | Documentation missing | Generate from code analysis, traffic inspection | No |
| Health Assessment | Health endpoints failing | Use monitoring data, log analysis | No |
| Dependency Mapping | Complex dependencies | Simplify mapping, focus on critical paths | No |
| Documentation | Documentation generation fails | Export raw data, manual documentation creation | No |

## Success Criteria

- Complete service inventory with all active services
- Network service discovery with protocol identification
- Configuration analysis with dependency extraction
- API documentation discovery with endpoint cataloging
- Service health assessment with performance metrics
- Dependency mapping with critical path analysis
- Comprehensive architecture documentation generated

## Environment Variables

```bash
# Required
REGISTRY_TYPE=consul
MONITORING_SYSTEM=prometheus
DOCUMENTATION_FORMAT=markdown
NETWORK_SCAN_TIMEOUT=30
HEALTH_CHECK_TIMEOUT=10

# Optional
INCLUDE_DEPRECATED=false
MAX_DEPENDENCY_DEPTH=5
PERFORMANCE_THRESHOLD_MS=1000
EXPORT_FORMAT=json
```

## Usage Examples

```bash
# Standard service discovery
skill invoke service-discovery --environment="production" --include-health="true" --generate-docs="true"

# Focused discovery with specific scope
skill invoke service-discovery --service-type="microservices" --depth="3" --format="yaml" --export-path="./docs/architecture"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Registry connectivity issues | Verify network access, check authentication, use alternative discovery |
| Incomplete service discovery | Combine multiple discovery methods, manual verification |
| Complex dependency mapping | Limit depth, focus on critical services, use visualization tools |
| Health assessment failures | Use alternative monitoring sources, log analysis, synthetic monitoring |

## Related Skills

- [production-deploy](deploy/production-deploy.md) - For deployment service dependencies
- [code-review](review/code-review.md) - For code-level dependency analysis
- [azure-deploy](../integration/azure/azure-deploy.md) - For cloud service discovery

## References

- Service discovery best practices guide
- Microservices architecture documentation
- Service mesh configuration guides
- Monitoring and observability standards
- Network discovery tools documentation
