# Real User Monitoring (RUM) Integration

Comprehensive Real User Monitoring integration with synthetic test correlation for multi-tenant SaaS platforms.

## Overview

This package provides enterprise-grade RUM capabilities including:
- Real-time user performance metrics collection
- Synthetic test correlation and variance analysis
- Production issue detection with automated alerting
- Multi-tenant data isolation with GDPR compliance
- Advanced statistical analysis and anomaly detection

## Features

### 🚀 Core Capabilities
- **Real User Monitoring**: Collect Core Web Vitals and user experience metrics
- **Synthetic Test Correlation**: Advanced correlation between synthetic and real user data
- **Performance Baselines**: Automated baseline establishment and monitoring
- **Issue Detection**: Automated production issue detection with classification
- **Multi-Tenant Support**: Complete data isolation and per-tenant analytics

### 📊 Analytics & Insights
- **Statistical Analysis**: Correlation scores, variance analysis, confidence intervals
- **Trend Detection**: Performance trend analysis with directional indicators
- **Geographic Segmentation**: Location-based performance analysis (privacy-compliant)
- **Device Segmentation**: Performance analysis by device type and capabilities
- **Network Analysis**: Connection type and quality impact assessment

### 🔒 Security & Privacy
- **GDPR Compliance**: User consent management and data minimization
- **Multi-Tenant Isolation**: Complete data separation between tenants
- **Data Sanitization**: PII protection and privacy-by-design principles
- **Audit Logging**: Comprehensive audit trails for all monitoring activities

## Installation

```bash
pnpm add @repo/monitoring
```

## Quick Start

### Client-Side RUM Tracking

```typescript
import { useRUMTracking } from '@repo/monitoring/client';

function MyComponent() {
  const { tracker, isTracking, grantConsent } = useRUMTracking({
    tenantId: 'your-tenant-id',
    userId: 'user-123', // optional
    consentRequired: true,
    sampleRate: 1.0, // Track 100% of users
  });

  const handleGrantConsent = () => {
    grantConsent();
  };

  return (
    <div>
      {isTracking ? (
        <p>Performance tracking active</p>
      ) : (
        <button onClick={handleGrantConsent}>
          Enable Performance Tracking
        </button>
      )}
    </div>
  );
}
```

### Server-Side RUM Integration

```typescript
import { rumIntegrationService } from '@repo/monitoring';

// Ingest RUM metrics from client
await rumIntegrationService.ingestRUMMetrics({
  lcp: 2100,
  inp: 150,
  cls: 0.08,
  ttfb: 450,
  tenantId: 'your-tenant-id',
  route: '/checkout',
  // ... other metrics
});

// Correlate with synthetic tests
const correlations = await rumIntegrationService.correlateSyntheticAndRUMData(
  'your-tenant-id',
  '/checkout'
);
```

### Production Dashboard

```typescript
import ProductionDashboard from '@repo/monitoring/ProductionDashboard';

function AdminPanel() {
  return (
    <div>
      <ProductionDashboard />
    </div>
  );
}
```

## Configuration

### RUM Tracker Configuration

```typescript
interface RUMTrackerConfig {
  tenantId: string;              // Required: Tenant identifier
  userId?: string;               // Optional: User identifier
  enableAutoTracking?: boolean;  // Default: true
  consentRequired?: boolean;     // Default: true (GDPR compliance)
  sampleRate?: number;          // Default: 1.0 (0-1)
  debug?: boolean;              // Default: false
  apiEndpoint?: string;         // Default: '/api/analytics/rum'
  batchSize?: number;           // Default: 10
  flushInterval?: number;       // Default: 30000 (ms)
}
```

### Correlation Analysis Configuration

```typescript
interface CorrelationConfig {
  timeWindow: number;              // Default: 3600000 (1 hour)
  minSampleSize: number;           // Default: 10
  significanceThreshold: number;    // Default: 0.05
  varianceThreshold: number;       // Default: 0.3 (30%)
  enableSeasonalAdjustment: boolean; // Default: true
  geographicWeighting: boolean;     // Default: true
  deviceSegmentation: boolean;     // Default: true
}
```

## API Reference

### RUMIntegrationService

Main service for RUM data ingestion and correlation analysis.

#### Methods

```typescript
// Ingest RUM metrics from client-side tracking
ingestRUMMetrics(metrics: Omit<RUMMetrics, 'sessionId'>): Promise<void>

// Ingest synthetic test results
ingestSyntheticTestResults(results: SyntheticTestResult[]): Promise<void>

// Correlate synthetic and RUM data
correlateSyntheticAndRUMData(tenantId: string, route: string, timeWindow?: number): Promise<CorrelationResult[]>

// Get performance baseline
getPerformanceBaseline(tenantId: string, route: string): Promise<PerformanceBaseline | null>
```

### CorrelationAnalyzer

Advanced statistical analysis for synthetic vs RUM correlation.

#### Methods

```typescript
// Analyze correlation between datasets
analyzeCorrelation(syntheticData: any[], rumData: any[]): CorrelationResult[]

// Generate correlation matrix
generateCorrelationMatrix(syntheticData: any[], rumData: any[]): CorrelationMatrix
```

### Client-Side Hooks

```typescript
// React hook for RUM tracking
useRUMTracking(config: RUMTrackerConfig, options?: RUMTrackerOptions): {
  tracker: RUMTracker | null;
  isTracking: boolean;
  isConsentGranted: boolean;
  trackCustomEvent: (type: string, data: any) => void;
  grantConsent: () => void;
  revokeConsent: () => void;
  session: RUMSession | null;
}

// Non-React RUM tracking
trackRUMMetrics(config: RUMTrackerConfig): RUMTracker

// Check if tracking is allowed
canTrackRUM(): boolean
```

## Database Schema

The RUM integration uses the following database tables:

### rum_metrics
Stores real user monitoring metrics collected from client-side tracking.

### synthetic_tests
Stores synthetic test results from automated performance testing.

### rum_synthetic_correlations
Stores correlation analysis results between synthetic and RUM data.

### performance_baselines
Stores performance baselines for tenant and route combinations.

### production_issues
Stores automated production issue detection results.

See `database/migrations/20260226000000_rum_integration.sql` for complete schema.

## CLI Tools

### Correlation Analysis

```bash
# Analyze correlations between synthetic and RUM data
pnpm correlate-metrics --tenant-id tenant-123 --route /checkout --time-window 6h --detailed

# Generate correlation report for all tenants
pnpm correlate-metrics --time-window 24h --detailed
```

### Issue Detection

```bash
# Run automated issue detection
pnpm issue-detection --tenant-id tenant-123 --send-alerts

# Dry run to preview detected issues
pnpm issue-detection --dry-run --detailed
```

## Performance Dashboard

The production dashboard provides:

- **Real-time Metrics**: Active users, average performance metrics, correlation scores
- **Performance Trends**: Core Web Vitals over time with interactive charts
- **Correlation Analysis**: Synthetic vs RUM variance breakdown and recommendations
- **Tenant Overview**: Per-tenant performance metrics and health status
- **Active Alerts**: Production issues with severity levels and recommendations

### Dashboard Features

- **Interactive Charts**: Zoomable, filterable performance visualizations
- **Real-time Updates**: 30-second refresh intervals
- **Multi-tenant View**: Tenant-specific and aggregated metrics
- **Alert Management**: Issue acknowledgment and resolution tracking
- **Export Capabilities**: Data export for further analysis

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test rum-integration.test.ts
```

### Integration Tests

```bash
# Test RUM ingestion pipeline
pnpm test:rum-ingestion

# Test correlation analysis
pnpm test:correlation

# Test issue detection
pnpm test:issue-detection
```

## Performance Considerations

### Client-Side Impact
- **Minimal Bundle Size**: ~15KB gzipped for full RUM tracking
- **Low Overhead**: <1ms performance impact on page load
- **Adaptive Sampling**: Configurable sampling rates to control data volume
- **Privacy-First**: No PII collection without explicit consent

### Server-Side Scaling
- **Batch Processing**: Efficient batch inserts for high-volume data
- **Async Processing**: Non-blocking correlation analysis
- **Caching**: Performance baseline caching for fast lookups
- **Connection Pooling**: Optimized database connection management

### Data Retention
- **Configurable Retention**: Adjustable data retention policies
- **Automatic Cleanup**: Background cleanup of expired data
- **Compression**: Compressed storage for historical data
- **Aggregation**: Pre-aggregated metrics for fast querying

## Security & Compliance

### GDPR Compliance
- **User Consent**: Explicit consent required for tracking
- **Data Minimization**: Collect only necessary performance data
- **Right to Withdraw**: Users can revoke consent at any time
- **Data Portability**: Export capabilities for user data

### Multi-Tenant Security
- **Data Isolation**: Complete separation of tenant data
- **Access Control**: Tenant-specific access controls
- **Audit Logging**: Comprehensive audit trails
- **Encryption**: Encrypted data storage and transmission

### Privacy Features
- **No PII**: No personally identifiable information collected
- **Anonymization**: Automatic data anonymization where applicable
- **Location Privacy**: Timezone-only location data (no precise coordinates)
- **Device Privacy**: Device type classification without unique identifiers

## Monitoring & Observability

### Metrics Collection
- **System Metrics**: Memory usage, processing times, error rates
- **Business Metrics**: User engagement, performance trends, issue rates
- **Technical Metrics**: Database performance, API response times
- **Quality Metrics**: Data quality, correlation accuracy, alert effectiveness

### Alerting
- **Performance Alerts**: Automatic alerts for performance degradation
- **Correlation Alerts**: Low correlation between synthetic and RUM data
- **Issue Alerts**: Automated production issue detection
- **System Alerts**: Infrastructure and service health monitoring

### Dashboards
- **Executive Dashboard**: High-level performance and health metrics
- **Technical Dashboard**: Detailed system performance and diagnostics
- **Tenant Dashboard**: Per-tenant performance and issue tracking
- **Alert Dashboard**: Active alerts and resolution tracking

## Troubleshooting

### Common Issues

#### Low Correlation Scores
- **Check Test Environment**: Ensure synthetic tests match production conditions
- **Review Network Conditions**: Real-world network variability affects correlation
- **Verify Device Coverage**: Ensure synthetic tests cover real user device distribution
- **Update Test Scenarios**: Align synthetic tests with actual user behavior patterns

#### High Memory Usage
- **Reduce Sample Rate**: Lower sampling percentage for high-traffic sites
- **Adjust Batch Size**: Optimize batch processing parameters
- **Enable Data Cleanup**: Configure appropriate data retention policies
- **Monitor Connection Pool**: Check database connection pool configuration

#### Missing Data
- **Verify Consent**: Ensure user consent is properly managed
- **Check Network Connectivity**: Verify API endpoints are accessible
- **Review Configuration**: Confirm tenant and route configurations
- **Validate Data Format**: Ensure data format matches expected schema

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const tracker = trackRUMMetrics({
  tenantId: 'your-tenant-id',
  debug: true, // Enable debug logging
});
```

### Health Checks

Monitor system health with built-in health checks:

```typescript
// Check RUM service health
const health = await rumIntegrationService.getHealthCheck();
console.log('RUM Service Health:', health);
```

## Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/marketing-websites.git
cd marketing-websites

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test
```

### Code Style

- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Follow project linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage required

### Submitting Changes

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Run test suite
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: See `/docs/monitoring/` for detailed guides
- **Issues**: Report issues via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Support**: Contact platform team for production support
