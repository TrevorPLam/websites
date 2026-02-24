/**
 * @file packages/infra/src/config.ts
 * @summary Centralized configuration management with type-safe environment variable access
 * @purpose Replace scattered process.env usage throughout the codebase with centralized config
 * @relationship Used by all packages requiring environment variables
 * @system role Central configuration hub for the entire monorepo
 */

import { validateEnv } from '../env';

/**
 * Centralized configuration class with type-safe environment variable access
 * Provides static getters for all environment variables used across the platform
 */
export class Config {
  /**
   * Get Supabase configuration
   */
  static get supabase() {
    return {
      url: this.required('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: this.required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      serviceKey: this.required('SUPABASE_SERVICE_ROLE_KEY'),
      replicaUrl: this.optional('SUPABASE_REPLICA_URL'),
      sessionUrl: this.optional('SUPABASE_SESSION_URL'),
    };
  }

  /**
   * Get Node environment
   */
  static get nodeEnv() {
    return this.optional('NODE_ENV') || 'development';
  }

  /**
   * Get site configuration
   */
  static get site() {
    return {
      name: this.required('NEXT_PUBLIC_SITE_NAME'),
      url: this.required('NEXT_PUBLIC_SITE_URL'),
      description: this.optional('NEXT_PUBLIC_SITE_DESCRIPTION'),
    };
  }

  /**
   * Get feature flags
   */
  static get features() {
    return {
      analytics: this.optional('NEXT_PUBLIC_ANALYTICS_ENABLED') === 'true',
      sentry: this.optional('SENTRY_DSN') ? true : false,
      rateLimiting: this.optional('ENABLE_RATE_LIMITING') !== 'false',
    };
  }

  /**
   * Get server configuration
   */
  static get server() {
    return {
      port: this.optional('PORT') ? parseInt(this.optional('PORT')!) : 3000,
      host: this.optional('HOST') || 'localhost',
    };
  }

  /**
   * Get development configuration
   */
  static get development() {
    return {
      isDevelopment: this.nodeEnv === 'development',
      isProduction: this.nodeEnv === 'production',
      isTest: this.nodeEnv === 'test',
    };
  }

  /**
   * Get crypto configuration
   */
  static get crypto() {
    return {
      symmetricKey: this.required('CRYPTO_SYMMETRIC_KEY'),
    };
  }

  /**
   * Get database configuration
   */
  static get database() {
    return {
      url: this.required('DATABASE_URL'),
      maxConnections: this.optional('DATABASE_MAX_CONNECTIONS')
        ? parseInt(this.optional('DATABASE_MAX_CONNECTIONS')!)
        : 100,
    };
  }

  /**
   * Get authentication configuration
   */
  static get auth() {
    return {
      jwtSecret: this.required('JWT_SECRET'),
      sessionSecret: this.required('SESSION_SECRET'),
      tokenExpiry: this.optional('JWT_TOKEN_EXPIRY')
        ? parseInt(this.optional('JWT_TOKEN_EXPIRY')!)
        : 86400, // 24 hours
    };
  }

  /**
   * Get monitoring configuration
   */
  static get monitoring() {
    return {
      sentryDsn: this.optional('SENTRY_DSN'),
      sentryEnvironment: this.optional('SENTRY_ENVIRONMENT') || this.nodeEnv,
      sentrySampleRate: this.optional('SENTRY_SAMPLE_RATE')
        ? parseFloat(this.optional('SENTRY_SAMPLE_RATE')!)
        : 1.0,
    };
  }

  /**
   * Get integration configuration
   */
  static get integrations() {
    return {
      hubspot: {
        apiKey: this.optional('HUBSPOT_API_KEY'),
        portalId: this.optional('HUBSPOT_PORTAL_ID'),
      },
      convertkit: {
        apiKey: this.optional('CONVERTKIT_API_KEY'),
        formId: this.optional('CONVERTKIT_FORM_ID'),
      },
      googleMaps: {
        apiKey: this.optional('GOOGLE_MAPS_API_KEY'),
      },
    };
  }

  /**
   * Get performance configuration
   */
  static get performance() {
    return {
      enableBundleAnalysis: this.optional('ENABLE_BUNDLE_ANALYSIS') === 'true',
      enableSourceMaps: this.optional('ENABLE_SOURCE_MAPS') === 'true',
      enableCache: this.optional('ENABLE_CACHE') !== 'false',
    };
  }

  /**
   * Required environment variable getter
   * Throws if variable is missing
   */
  private static required(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  /**
   * Optional environment variable getter
   * Returns undefined if variable is missing
   */
  private static optional(key: string): string | undefined {
    return process.env[key];
  }

  /**
   * Validate all environment variables
   * Call this at application startup
   */
  static validate() {
    try {
      return validateEnv();
    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw error;
    }
  }

  /**
   * Get complete validated environment
   * For advanced usage where you need the full env object
   */
  static getEnv() {
    return this.validate();
  }
}

/**
 * Export the validated environment for backward compatibility
 */
export const env = Config.getEnv();

/**
 * Export configuration sections for convenience
 */
export const config = {
  supabase: Config.supabase,
  nodeEnv: Config.nodeEnv,
  site: Config.site,
  features: Config.features,
  server: Config.server,
  development: Config.development,
  crypto: Config.crypto,
  database: Config.database,
  auth: Config.auth,
  monitoring: Config.monitoring,
  integrations: Config.integrations,
  performance: Config.performance,
};
