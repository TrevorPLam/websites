-- Test Database Initialization Script
-- Sets up test database schema and seed data for integration tests

-- Create test database if it doesn't exist
CREATE DATABASE IF NOT EXISTS marketing_websites_test;

-- Use test database
\c marketing_websites_test;

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test schemas
CREATE SCHEMA IF NOT EXISTS test_data;
CREATE SCHEMA IF NOT EXISTS test_auth;

-- Tenants table for multi-tenant testing
CREATE TABLE IF NOT EXISTS test_data.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for authentication testing
CREATE TABLE IF NOT EXISTS test_data.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES test_data.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Bookings table for testing booking functionality
CREATE TABLE IF NOT EXISTS test_data.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES test_data.tenants(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS test_data.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES test_data.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table for testing blog functionality
CREATE TABLE IF NOT EXISTS test_data.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES test_data.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id ON test_data.bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON test_data.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON test_data.bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON test_data.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON test_data.users(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_tenant_id ON test_data.contact_submissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tenant_id ON test_data.blog_posts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON test_data.blog_posts(published);

-- Enable Row Level Security for multi-tenant isolation
ALTER TABLE test_data.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_data.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_data.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_data.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_data.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
-- Tenants table (read-only for tests)
CREATE POLICY test_tenant_policy ON test_data.tenants
    FOR ALL USING (true);

-- Users table - users can only access their own tenant's data
CREATE POLICY test_users_policy ON test_data.users
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Bookings table - tenant isolation
CREATE POLICY test_bookings_policy ON test_data.bookings
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Contact submissions table - tenant isolation
CREATE POLICY test_contact_submissions_policy ON test_data.contact_submissions
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Blog posts table - tenant isolation
CREATE POLICY test_blog_posts_policy ON test_data.blog_posts
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Insert seed data for testing
INSERT INTO test_data.tenants (site_id, name, domain, settings) VALUES
('test-site-001', 'Test Tenant One', 'test1.example.com', '{"theme": "light", "features": ["booking", "blog"]}'),
('test-site-002', 'Test Tenant Two', 'test2.example.com', '{"theme": "dark", "features": ["booking", "contact"]}'),
('test-site-003', 'Test Tenant Three', 'test3.example.com', '{"theme": "auto", "features": ["blog", "contact"]}')
ON CONFLICT (site_id) DO NOTHING;

-- Insert test users
INSERT INTO test_data.users (tenant_id, email, name, role) 
SELECT 
    t.id,
    'user@' || REPLACE(t.domain, '.', '_'),
    'Test User for ' || t.name,
    'admin'
FROM test_data.tenants t
ON CONFLICT (tenant_id, email) DO NOTHING;

-- Insert test bookings
INSERT INTO test_data.bookings (tenant_id, customer_name, customer_email, service, start_time, end_time, status)
SELECT 
    t.id,
    'John Doe',
    'john.doe@example.com',
    'consultation',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '2 days',
    'confirmed'
FROM test_data.tenants t
WHERE t.site_id = 'test-site-001'
ON CONFLICT DO NOTHING;

-- Insert test contact submissions
INSERT INTO test_data.contact_submissions (tenant_id, name, email, phone, message, consent)
SELECT 
    t.id,
    'Jane Smith',
    'jane.smith@example.com',
    '+1234567890',
    'Test message for ' || t.name,
    true
FROM test_data.tenants t
WHERE t.site_id = 'test-site-002'
ON CONFLICT DO NOTHING;

-- Insert test blog posts
INSERT INTO test_data.blog_posts (tenant_id, title, slug, content, excerpt, published, published_at)
SELECT 
    t.id,
    'Test Blog Post for ' || t.name,
    'test-post-' || t.site_id,
    'This is test content for the blog post.',
    'Test excerpt for ' || t.name,
    true,
    NOW()
FROM test_data.tenants t
WHERE t.site_id = 'test-site-003'
ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Create test functions for database operations
CREATE OR REPLACE FUNCTION test_data.get_tenant_bookings(p_tenant_id UUID)
RETURNS TABLE (
    id UUID,
    customer_name VARCHAR,
    customer_email VARCHAR,
    service VARCHAR,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR
) AS $$
BEGIN
    SET LOCAL app.current_tenant_id = p_tenant_id;
    RETURN QUERY
    SELECT 
        b.id,
        b.customer_name,
        b.customer_email,
        b.service,
        b.start_time,
        b.end_time,
        b.status
    FROM test_data.bookings b
    WHERE b.tenant_id = p_tenant_id
    ORDER BY b.start_time DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create test function for creating bookings
CREATE OR REPLACE FUNCTION test_data.create_booking(
    p_tenant_id UUID,
    p_customer_name VARCHAR,
    p_customer_email VARCHAR,
    p_service VARCHAR,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE
)
RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
BEGIN
    SET LOCAL app.current_tenant_id = p_tenant_id;
    
    INSERT INTO test_data.bookings (
        tenant_id,
        customer_name,
        customer_email,
        service,
        start_time,
        end_time,
        status
    ) VALUES (
        p_tenant_id,
        p_customer_name,
        p_customer_email,
        p_service,
        p_start_time,
        p_end_time,
        'pending'
    ) RETURNING id INTO v_booking_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA test_data TO test_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA test_data TO test_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA test_data TO test_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA test_data TO test_user;

-- Create test user for database connections
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'test_user') THEN
        CREATE ROLE test_user WITH LOGIN PASSWORD 'test_password';
    END IF;
END
$$;

-- Output completion message
SELECT 'Test database setup completed successfully' as status;
