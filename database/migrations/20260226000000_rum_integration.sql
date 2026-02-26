-- Migration: RUM Integration Tables
-- Description: Create tables for Real User Monitoring integration with synthetic test correlation
-- Requirements: TASK-007 / rum-integration / database-schema
-- Version: 2026.02.26

-- RUM Metrics Table
CREATE TABLE IF NOT EXISTS rum_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255) NOT NULL,
    route VARCHAR(500) NOT NULL,
    
    -- Core Web Vitals
    lcp DECIMAL(10,2), -- Largest Contentful Paint (ms)
    inp DECIMAL(10,2), -- Interaction to Next Paint (ms)
    cls DECIMAL(10,4), -- Cumulative Layout Shift
    ttfb DECIMAL(10,2), -- Time to First Byte (ms)
    fid DECIMAL(10,2), -- First Input Delay (ms) - legacy
    
    -- User Experience Metrics
    route_change_time DECIMAL(10,2),
    api_response_time DECIMAL(10,2),
    render_time DECIMAL(10,2),
    first_contentful_paint DECIMAL(10,2),
    
    -- Context Information
    user_agent TEXT,
    viewport_width INTEGER,
    viewport_height INTEGER,
    connection_type VARCHAR(50),
    connection_downlink DECIMAL(8,2),
    connection_rtt INTEGER,
    
    -- Location Information (GDPR-compliant)
    location_country VARCHAR(2), -- ISO 3166-1 alpha-2
    location_city VARCHAR(100),
    location_timezone VARCHAR(100),
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    page_load_start TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT rum_metrics_tenant_check CHECK (tenant_id IS NOT NULL AND length(tenant_id) > 0),
    CONSTRAINT rum_metrics_session_check CHECK (session_id IS NOT NULL AND length(session_id) > 0),
    CONSTRAINT rum_metrics_route_check CHECK (route IS NOT NULL AND length(route) > 0),
    CONSTRAINT rum_metrics_lcp_check CHECK (lcp > 0),
    CONSTRAINT rum_metrics_inp_check CHECK (inp >= 0),
    CONSTRAINT rum_metrics_cls_check CHECK (cls >= 0),
    CONSTRAINT rum_metrics_ttfb_check CHECK (ttfb > 0)
);

-- Synthetic Tests Table
CREATE TABLE IF NOT EXISTS synthetic_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id VARCHAR(255) NOT NULL UNIQUE,
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'lighthouse', 'playwright', 'custom'
    
    -- Test Configuration
    environment VARCHAR(50) NOT NULL, -- 'staging', 'production'
    browser VARCHAR(100),
    viewport_width INTEGER,
    viewport_height INTEGER,
    
    -- Network Configuration
    connection_type VARCHAR(50),
    connection_latency INTEGER,
    connection_download_speed DECIMAL(8,2),
    
    -- Core Web Vitals Results
    lcp DECIMAL(10,2) NOT NULL,
    inp DECIMAL(10,2) NOT NULL,
    cls DECIMAL(10,4) NOT NULL,
    ttfb DECIMAL(10,2) NOT NULL,
    
    -- Test Results
    duration INTEGER NOT NULL, -- Test duration in milliseconds
    passed BOOLEAN NOT NULL,
    score DECIMAL(5,2), -- Overall performance score (0-100)
    violations JSONB, -- Array of violation messages
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT synthetic_tests_test_id_check CHECK (test_id IS NOT NULL AND length(test_id) > 0),
    CONSTRAINT synthetic_tests_test_name_check CHECK (test_name IS NOT NULL AND length(test_name) > 0),
    CONSTRAINT synthetic_tests_test_type_check CHECK (test_type IN ('lighthouse', 'playwright', 'custom')),
    CONSTRAINT synthetic_tests_environment_check CHECK (environment IN ('staging', 'production')),
    CONSTRAINT synthetic_tests_lcp_check CHECK (lcp > 0),
    CONSTRAINT synthetic_tests_inp_check CHECK (inp >= 0),
    CONSTRAINT synthetic_tests_cls_check CHECK (cls >= 0),
    CONSTRAINT synthetic_tests_ttfb_check CHECK (ttfb > 0),
    CONSTRAINT synthetic_tests_duration_check CHECK (duration > 0),
    CONSTRAINT synthetic_tests_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

-- RUM-Synthetic Correlations Table
CREATE TABLE IF NOT EXISTS rum_synthetic_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    synthetic_test_id VARCHAR(255) NOT NULL REFERENCES synthetic_tests(test_id),
    rum_session_id VARCHAR(255) NOT NULL,
    
    -- Correlation Analysis
    correlation_score DECIMAL(5,4) NOT NULL, -- 0-1 correlation score
    lcp_variance DECIMAL(5,4) NOT NULL,
    inp_variance DECIMAL(5,4) NOT NULL,
    cls_variance DECIMAL(5,4) NOT NULL,
    ttfb_variance DECIMAL(5,4) NOT NULL,
    overall_variance DECIMAL(5,4) NOT NULL,
    
    -- Impact Assessment
    impact_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    performance_gap DECIMAL(5,2) NOT NULL, -- Percentage gap
    user_experience_impact VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    
    -- Recommendations
    recommendations JSONB, -- Array of recommendation strings
    
    -- Detailed Metrics (for analysis)
    synthetic_metrics JSONB,
    rum_metrics JSONB,
    
    -- Metadata
    sample_size INTEGER NOT NULL,
    time_window INTEGER NOT NULL, -- Time window in milliseconds
    statistical_significance DECIMAL(8,6), -- p-value
    confidence_interval JSONB, -- { lower: number, upper: number }
    trend_direction VARCHAR(20), -- 'improving', 'degrading', 'stable'
    
    -- Timestamps
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT rum_synthetic_correlations_score_check CHECK (correlation_score >= 0 AND correlation_score <= 1),
    CONSTRAINT rum_synthetic_correlations_variance_check CHECK (
        lcp_variance >= 0 AND lcp_variance <= 1 AND
        inp_variance >= 0 AND inp_variance <= 1 AND
        cls_variance >= 0 AND cls_variance <= 1 AND
        ttfb_variance >= 0 AND ttfb_variance <= 1 AND
        overall_variance >= 0 AND overall_variance <= 1
    ),
    CONSTRAINT rum_synthetic_correlations_impact_check CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT rum_synthetic_correlations_ux_impact_check CHECK (user_experience_impact IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT rum_synthetic_correlations_gap_check CHECK (performance_gap >= 0),
    CONSTRAINT rum_synthetic_correlations_sample_check CHECK (sample_size > 0),
    CONSTRAINT rum_synthetic_correlations_window_check CHECK (time_window > 0),
    CONSTRAINT rum_synthetic_correlations_trend_check CHECK (trend_direction IS NULL OR trend_direction IN ('improving', 'degrading', 'stable'))
);

-- Performance Baselines Table
CREATE TABLE IF NOT EXISTS performance_baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    route VARCHAR(500) NOT NULL,
    
    -- Baseline Metrics (percentiles)
    baseline_metrics JSONB NOT NULL, -- { lcp: { p50, p75, p90, p95 }, inp: {...}, cls: {...}, ttfb: {...} }
    
    -- Synthetic Test Reference
    synthetic_baseline JSONB NOT NULL, -- Reference synthetic test result
    
    -- Metadata
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL,
    sample_size INTEGER NOT NULL,
    confidence_level DECIMAL(5,4) DEFAULT 0.95, -- Statistical confidence level
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT performance_baselines_tenant_check CHECK (tenant_id IS NOT NULL AND length(tenant_id) > 0),
    CONSTRAINT performance_baselines_route_check CHECK (route IS NOT NULL AND length(route) > 0),
    CONSTRAINT performance_baselines_sample_check CHECK (sample_size > 0),
    CONSTRAINT performance_baselines_confidence_check CHECK (confidence_level > 0 AND confidence_level <= 1),
    
    -- Unique constraint per tenant and route
    UNIQUE(tenant_id, route)
);

-- Production Issues Table
CREATE TABLE IF NOT EXISTS production_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL, -- 'PERFORMANCE_DEGRADATION', 'CORRELATION_ANOMALY', etc.
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    
    -- Issue Classification
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    metric VARCHAR(50), -- 'lcp', 'inp', 'cls', 'ttfb', 'correlation_score', etc.
    value DECIMAL(15,4),
    threshold DECIMAL(15,4),
    
    -- Context
    tenant_id VARCHAR(255),
    route VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Detailed Data
    data_point JSONB, -- Original data point that triggered the issue
    auto_resolve BOOLEAN DEFAULT false,
    
    -- Recommendations
    recommendations JSONB, -- Array of recommendation strings
    
    -- Issue Management
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'acknowledged', 'investigating', 'resolved', 'closed'
    assigned_to VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT production_issues_severity_check CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT production_issues_status_check CHECK (status IN ('open', 'acknowledged', 'investigating', 'resolved', 'closed')),
    CONSTRAINT production_issues_value_check CHECK (value IS NULL OR value >= 0),
    CONSTRAINT production_issues_threshold_check CHECK (threshold IS NULL OR threshold >= 0)
);

-- Indexes for RUM Metrics
CREATE INDEX IF NOT EXISTS idx_rum_metrics_tenant_timestamp ON rum_metrics(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rum_metrics_session_timestamp ON rum_metrics(session_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rum_metrics_route_timestamp ON rum_metrics(route, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rum_metrics_tenant_route ON rum_metrics(tenant_id, route);
CREATE INDEX IF NOT EXISTS idx_rum_metrics_timestamp ON rum_metrics(timestamp DESC);

-- Indexes for Synthetic Tests
CREATE INDEX IF NOT EXISTS idx_synthetic_tests_timestamp ON synthetic_tests(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_synthetic_tests_environment ON synthetic_tests(environment);
CREATE INDEX IF NOT EXISTS idx_synthetic_tests_test_type ON synthetic_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_synthetic_tests_passed ON synthetic_tests(passed);

-- Indexes for Correlations
CREATE INDEX IF NOT EXISTS idx_rum_synthetic_correlations_synthetic ON rum_synthetic_correlations(synthetic_test_id);
CREATE INDEX IF NOT EXISTS idx_rum_synthetic_correlations_session ON rum_synthetic_correlations(rum_session_id);
CREATE INDEX IF NOT EXISTS idx_rum_synthetic_correlations_score ON rum_synthetic_correlations(correlation_score);
CREATE INDEX IF NOT EXISTS idx_rum_synthetic_correlations_impact ON rum_synthetic_correlations(impact_level);
CREATE INDEX IF NOT EXISTS idx_rum_synthetic_correlations_timestamp ON rum_synthetic_correlations(timestamp DESC);

-- Indexes for Performance Baselines
CREATE INDEX IF NOT EXISTS idx_performance_baselines_tenant_route ON performance_baselines(tenant_id, route);
CREATE INDEX IF NOT EXISTS idx_performance_baselines_updated ON performance_baselines(last_updated DESC);

-- Indexes for Production Issues
CREATE INDEX IF NOT EXISTS idx_production_issues_severity ON production_issues(severity);
CREATE INDEX IF NOT EXISTS idx_production_issues_status ON production_issues(status);
CREATE INDEX IF NOT EXISTS idx_production_issues_type ON production_issues(type);
CREATE INDEX IF NOT EXISTS idx_production_issues_tenant ON production_issues(tenant_id);
CREATE INDEX IF NOT EXISTS idx_production_issues_timestamp ON production_issues(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_production_issues_open ON production_issues(severity, status) WHERE status = 'open';

-- Row Level Security (RLS) Policies
ALTER TABLE rum_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rum_synthetic_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policy for RUM Metrics (tenant isolation)
CREATE POLICY "Users can view their own tenant RUM metrics" ON rum_metrics
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        tenant_id = current_setting('app.current_tenant_id', true)
    );

CREATE POLICY "Service can insert RUM metrics" ON rum_metrics
    FOR INSERT WITH CHECK (
        current_setting('app.service_role', true) = 'true' OR
        (auth.uid() IS NOT NULL AND tenant_id = current_setting('app.current_tenant_id', true))
    );

-- RLS Policy for Synthetic Tests (read-only for most users)
CREATE POLICY "All users can view synthetic tests" ON synthetic_tests
    FOR SELECT USING (true);

CREATE POLICY "Service can manage synthetic tests" ON synthetic_tests
    FOR ALL USING (
        current_setting('app.service_role', true) = 'true'
    );

-- RLS Policy for Correlations (tenant isolation)
CREATE POLICY "Users can view their own tenant correlations" ON rum_synthetic_correlations
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        EXISTS (
            SELECT 1 FROM rum_metrics rm 
            WHERE rm.session_id = rum_synthetic_correlations.rum_session_id 
            AND rm.tenant_id = current_setting('app.current_tenant_id', true)
        )
    );

CREATE POLICY "Service can manage correlations" ON rum_synthetic_correlations
    FOR ALL USING (
        current_setting('app.service_role', true) = 'true'
    );

-- RLS Policy for Performance Baselines (tenant isolation)
CREATE POLICY "Users can view their own tenant baselines" ON performance_baselines
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        tenant_id = current_setting('app.current_tenant_id', true)
    );

CREATE POLICY "Service can manage baselines" ON performance_baselines
    FOR ALL USING (
        current_setting('app.service_role', true) = 'true'
    );

-- RLS Policy for Production Issues (tenant isolation with escalation visibility)
CREATE POLICY "Users can view their own tenant issues" ON production_issues
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (tenant_id = current_setting('app.current_tenant_id', true) OR severity = 'critical')
    );

CREATE POLICY "Service can manage production issues" ON production_issues
    FOR ALL USING (
        current_setting('app.service_role', true) = 'true'
    );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_synthetic_tests_updated_at 
    BEFORE UPDATE ON synthetic_tests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_baselines_updated_at 
    BEFORE UPDATE ON performance_baselines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_issues_updated_at 
    BEFORE UPDATE ON production_issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE rum_metrics IS 'Real User Monitoring metrics collected from client-side tracking';
COMMENT ON TABLE synthetic_tests IS 'Synthetic test results from automated performance testing';
COMMENT ON TABLE rum_synthetic_correlations IS 'Correlation analysis between synthetic and RUM data';
COMMENT ON TABLE performance_baselines IS 'Performance baselines for tenant and route combinations';
COMMENT ON TABLE production_issues IS 'Automated production issue detection and tracking';

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT ON rum_metrics TO authenticated;
-- GRANT SELECT ON synthetic_tests TO authenticated;
-- GRANT SELECT ON rum_synthetic_correlations TO authenticated;
-- GRANT SELECT ON performance_baselines TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON production_issues TO authenticated;
