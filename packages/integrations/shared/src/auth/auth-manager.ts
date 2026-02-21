/**
 * @file packages/integrations/shared/src/auth/auth-manager.ts
 * Task: Standardize authentication patterns (OAuth 2.1, API key security)
 *
 * Purpose: Provides unified authentication management following 2026 security standards.
 * Implements OAuth 2.1 with PKCE, secure API key management, and token handling.
 *
 * Created: 2026-02-21
 * Standards: OAuth 2.1 with PKCE, secure header authentication, token refresh
 */

import type { AuthConfig, ApiKeyAuth, OAuth2Config } from '../types/adapter';
import { createLogger } from '../utils/logger';

const logger = createLogger('auth-manager');

/**
 * OAuth 2.1 PKCE implementation following 2026 standards
 */
export class PKCEManager {
  /**
   * Generate a code verifier for PKCE
   * Must be cryptographically random and 43-128 characters
   */
  static generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate code challenge from verifier
   * Uses SHA256 as required by PKCE
   */
  static async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Verify code challenge against verifier
   */
  static async verifyCodeChallenge(verifier: string, challenge: string): Promise<boolean> {
    const computedChallenge = await this.generateCodeChallenge(verifier);
    return computedChallenge === challenge;
  }
}

/**
 * Token storage interface for OAuth 2.1 tokens
 */
export interface TokenStorage {
  setToken(integrationId: string, token: OAuthToken): Promise<void>;
  getToken(integrationId: string): Promise<OAuthToken | null>;
  removeToken(integrationId: string): Promise<void>;
}

/**
 * OAuth token structure following 2026 standards
 */
export interface OAuthToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
  scope?: string;
  acquiredAt: number;
  expiresAt?: number;
}

/**
 * In-memory token storage (for development/testing)
 */
export class MemoryTokenStorage implements TokenStorage {
  private tokens: Map<string, OAuthToken> = new Map();

  async setToken(integrationId: string, token: OAuthToken): Promise<void> {
    this.tokens.set(integrationId, token);
  }

  async getToken(integrationId: string): Promise<OAuthToken | null> {
    return this.tokens.get(integrationId) || null;
  }

  async removeToken(integrationId: string): Promise<void> {
    this.tokens.delete(integrationId);
  }
}

/**
 * Authentication manager implementing 2026 security standards
 */
export class AuthManager {
  private tokenStorage: TokenStorage;

  constructor(tokenStorage?: TokenStorage) {
    this.tokenStorage = tokenStorage || new MemoryTokenStorage();
  }

  /**
   * Build secure headers for API requests
   * Following 2026 best practices for header-based authentication
   */
  async buildHeaders(
    authConfig: AuthConfig,
    integrationId: string
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'marketing-websites/1.0.0',
    };

    switch (authConfig.type) {
      case 'api_key':
        return this.buildApiKeyHeaders(authConfig, headers);

      case 'oauth2':
        return this.buildOAuthHeaders(authConfig, integrationId, headers);

      default:
        throw new Error(`Unsupported auth type: ${(authConfig as any).type}`);
    }
  }

  /**
   * Build API key headers following 2026 security practices
   * Never expose API keys in request body or URLs
   */
  private buildApiKeyHeaders(
    authConfig: ApiKeyAuth,
    baseHeaders: Record<string, string>
  ): Record<string, string> {
    const { key, headerName, prefix = '' } = authConfig;

    if (!key) {
      throw new Error('API key is required');
    }

    // Use secure header authentication (2026 best practice)
    baseHeaders[headerName] = `${prefix}${key}`;

    logger.debug('Built API key headers', {
      headerName,
      hasPrefix: !!prefix,
      keyLength: key.length,
    });

    return baseHeaders;
  }

  /**
   * Build OAuth 2.1 headers with automatic token refresh
   */
  private async buildOAuthHeaders(
    authConfig: OAuth2Config,
    integrationId: string,
    baseHeaders: Record<string, string>
  ): Promise<Record<string, string>> {
    // Get current token or refresh if needed
    const token = await this.getValidToken(authConfig, integrationId);

    if (!token) {
      throw new Error('No valid OAuth token available');
    }

    baseHeaders['Authorization'] = `${token.tokenType} ${token.accessToken}`;

    logger.debug('Built OAuth headers', {
      tokenType: token.tokenType,
      hasRefreshToken: !!token.refreshToken,
      expiresAt: token.expiresAt,
    });

    return baseHeaders;
  }

  /**
   * Get valid OAuth token, refreshing if necessary
   */
  private async getValidToken(
    authConfig: OAuth2Config,
    integrationId: string
  ): Promise<OAuthToken | null> {
    const currentToken = await this.tokenStorage.getToken(integrationId);

    // Check if token is still valid
    if (currentToken && this.isTokenValid(currentToken)) {
      return currentToken;
    }

    // Try to refresh if we have a refresh token
    if (currentToken?.refreshToken) {
      try {
        const refreshedToken = await this.refreshToken(authConfig, currentToken.refreshToken);
        await this.tokenStorage.setToken(integrationId, refreshedToken);
        return refreshedToken;
      } catch (error) {
        logger.warn('Failed to refresh OAuth token', { integrationId, error: String(error) });
      }
    }

    return null;
  }

  /**
   * Check if OAuth token is still valid
   */
  private isTokenValid(token: OAuthToken): boolean {
    if (!token.expiresAt) {
      // Token without expiry - assume it's valid
      return true;
    }

    // Add 60-second buffer to prevent using expired tokens
    const now = Date.now();
    const expiresAt = token.expiresAt * 1000; // Convert to milliseconds
    return now < expiresAt - 60000;
  }

  /**
   * Refresh OAuth token using refresh token
   */
  private async refreshToken(authConfig: OAuth2Config, refreshToken: string): Promise<OAuthToken> {
    logger.debug('Refreshing OAuth token', {
      clientId: authConfig.clientId,
      tokenEndpoint: authConfig.tokenEndpoint,
    });

    const response = await fetch(authConfig.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: authConfig.clientId,
        client_secret: authConfig.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OAuth token refresh failed: ${response.status} ${error}`);
    }

    const tokenData = await response.json();

    const token: OAuthToken = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken,
      tokenType: tokenData.token_type || 'Bearer',
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      acquiredAt: Date.now(),
      expiresAt: tokenData.expires_in
        ? Math.floor(Date.now() / 1000) + tokenData.expires_in
        : undefined,
    };

    logger.info('OAuth token refreshed successfully', {
      expiresIn: token.expiresIn,
      hasRefreshToken: !!token.refreshToken,
    });

    return token;
  }

  /**
   * Exchange authorization code for access token (OAuth 2.1 with PKCE)
   */
  async exchangeCodeForToken(
    authConfig: OAuth2Config,
    code: string,
    codeVerifier: string
  ): Promise<OAuthToken> {
    logger.debug('Exchanging authorization code for token', {
      clientId: authConfig.clientId,
      tokenEndpoint: authConfig.tokenEndpoint,
      hasCodeVerifier: !!codeVerifier,
    });

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      redirect_uri: authConfig.redirectUri,
    });

    // Add PKCE if required (OAuth 2.1 standard)
    if (authConfig.usePKCE && codeVerifier) {
      body.append('code_verifier', codeVerifier);
    }

    const response = await fetch(authConfig.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OAuth token exchange failed: ${response.status} ${error}`);
    }

    const tokenData = await response.json();

    const token: OAuthToken = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type || 'Bearer',
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      acquiredAt: Date.now(),
      expiresAt: tokenData.expires_in
        ? Math.floor(Date.now() / 1000) + tokenData.expires_in
        : undefined,
    };

    logger.info('OAuth token exchanged successfully', {
      expiresIn: token.expiresIn,
      hasRefreshToken: !!token.refreshToken,
      scope: token.scope,
    });

    return token;
  }

  /**
   * Store OAuth token securely
   */
  async storeToken(integrationId: string, token: OAuthToken): Promise<void> {
    await this.tokenStorage.setToken(integrationId, token);
    logger.debug('OAuth token stored', { integrationId });
  }

  /**
   * Remove stored OAuth token
   */
  async removeToken(integrationId: string): Promise<void> {
    await this.tokenStorage.removeToken(integrationId);
    logger.debug('OAuth token removed', { integrationId });
  }

  /**
   * Generate OAuth 2.1 authorization URL with PKCE
   */
  generateAuthUrl(authConfig: OAuth2Config, codeChallenge?: string): string {
    const authUrl = new URL(authConfig.authEndpoint);

    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', authConfig.clientId);
    authUrl.searchParams.set('redirect_uri', authConfig.redirectUri);
    authUrl.searchParams.set('scope', authConfig.scopes.join(' '));

    // Add PKCE for OAuth 2.1 compliance
    if (authConfig.usePKCE && codeChallenge) {
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');
    }

    // Add state for CSRF protection
    const state = this.generateState();
    authUrl.searchParams.set('state', state);

    logger.debug('Generated OAuth authorization URL', {
      authEndpoint: authConfig.authEndpoint,
      clientId: authConfig.clientId,
      usePKCE: authConfig.usePKCE,
      hasCodeChallenge: !!codeChallenge,
    });

    return authUrl.toString();
  }

  /**
   * Generate cryptographically secure state parameter
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

/**
 * Global auth manager instance
 */
export const authManager = new AuthManager();

/**
 * Helper function to create API key auth config
 */
export function createApiKeyAuth(
  key: string,
  headerName: string = 'X-Api-Key',
  prefix: string = ''
): ApiKeyAuth {
  return {
    type: 'api_key',
    key,
    headerName,
    prefix,
  };
}

/**
 * Helper function to create OAuth 2.1 config
 */
export function createOAuth2Config(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authEndpoint: string,
  tokenEndpoint: string,
  scopes: string[],
  usePKCE: boolean = true
): OAuth2Config {
  return {
    type: 'oauth2',
    clientId,
    clientSecret,
    redirectUri,
    authEndpoint,
    tokenEndpoint,
    scopes,
    usePKCE,
  };
}
