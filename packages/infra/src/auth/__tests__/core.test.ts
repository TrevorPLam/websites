/**
 * @file packages/infra/src/auth/__tests__/core.test.ts
 * @summary Tests for 2026-compliant authentication core
 */

// Set JWT_SECRET BEFORE importing the module — auth/core.ts instantiates
// a default AuthService at module load time (line 629) and throws if missing.
process.env.JWT_SECRET = 'test-secret-for-jest';

// Uses Jest (project-wide test framework) — NOT vitest
import { AuthService, TokenValidator, SessionManager, PKCEManager } from '../core';
import { auditLogger } from '../../../security/audit-logger';

// Mock dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  SignJWT: jest.fn(),
}));

const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

describe('TokenValidator', () => {
  let tokenValidator: TokenValidator;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    tokenValidator = new TokenValidator();
  });

  it('should validate JWT token successfully', async () => {
    const { jwtVerify } = await import('jose');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: {
        sub: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        roles: ['user'],
        mfa_verified: true,
        exp: Date.now() / 1000 + 3600,
        iat: Date.now() / 1000,
        jti: '123e4567-e89b-12d3-a456-426614174001',
      },
    });

    const result = await tokenValidator.validate('valid-token');

    expect(result).toEqual({
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      mfa_verified: true,
      exp: expect.any(Number),
      iat: expect.any(Number),
      jti: '123e4567-e89b-12d3-a456-426614174001',
    });
  });

  it('should return null for invalid token', async () => {
    const { jwtVerify } = await import('jose');
    (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    const result = await tokenValidator.validate('invalid-token');
    expect(result).toBeNull();
  });

  it('should generate JWT token', async () => {
    const { SignJWT } = await import('jose');
    const mockSignJWT = {
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      setIssuer: jest.fn().mockReturnThis(),
      setAudience: jest.fn().mockReturnThis(),
      setJti: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('generated-token'),
    };
    (SignJWT as jest.Mock).mockImplementation(() => mockSignJWT);

    const token = await tokenValidator.generate({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
    });

    expect(token).toBe('generated-token');
    expect(mockSignJWT.setProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
  });
});

describe('SessionManager', () => {
  let sessionManager: SessionManager;

  beforeEach(() => {
    jest.clearAllMocks();
    const { cookies } = jest.requireMock('next/headers');
    (cookies as jest.Mock).mockReturnValue(mockCookies);
    sessionManager = new SessionManager();
  });

  it('should create session successfully', async () => {
    mockCookies.get.mockReturnValue(undefined); // No existing session

    const result = await sessionManager.createSession({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('sessionId');
    expect(mockCookies.set).toHaveBeenCalledWith('session', expect.any(String), {
      httpOnly: true,
      secure: false, // NODE_ENV !== 'production'
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/',
    });
  });

  it('should validate existing session', async () => {
    const mockToken = 'valid-session-token';
    mockCookies.get.mockReturnValue({ value: mockToken });

    // Mock TokenValidator.prototype.validate so it affects all instances
    jest.spyOn(TokenValidator.prototype, 'validate').mockResolvedValue({
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      org_id: '123e4567-e89b-12d3-a456-426614174002',
      mfa_verified: true,
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      jti: '123e4567-e89b-12d3-a456-426614174001',
    });

    const result = await sessionManager.validateSession();

    expect(result).toEqual({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: '123e4567-e89b-12d3-a456-426614174001',
      correlationId: expect.any(String),
    });
  });

  it('should destroy session', async () => {
    await sessionManager.destroySession();
    expect(mockCookies.delete).toHaveBeenCalledWith('session');
  });
});

describe('PKCEManager', () => {
  it('should generate PKCE parameters', async () => {
    const pkce = await PKCEManager.generatePKCE();

    expect(pkce).toHaveProperty('codeVerifier');
    expect(pkce).toHaveProperty('codeChallenge');
    expect(pkce).toHaveProperty('codeChallengeMethod', 'S256');
    expect(typeof pkce.codeVerifier).toBe('string');
    expect(typeof pkce.codeChallenge).toBe('string');
    expect(pkce.codeVerifier.length).toBeGreaterThan(0);
    expect(pkce.codeChallenge.length).toBeGreaterThan(0);
  });

  it('should verify PKCE challenge', async () => {
    const pkce = await PKCEManager.generatePKCE();
    const isValid = await PKCEManager.verifyPKCE(pkce.codeVerifier, pkce.codeChallenge);

    expect(isValid).toBe(true);
  });

  it('should reject invalid PKCE challenge', async () => {
    const pkce = await PKCEManager.generatePKCE();
    const isValid = await PKCEManager.verifyPKCE('invalid-verifier', pkce.codeChallenge);

    expect(isValid).toBe(false);
  });
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    const { cookies } = jest.requireMock('next/headers');
    (cookies as jest.Mock).mockReturnValue(mockCookies);
    authService = new AuthService();
  });

  it('should verify authentication successfully', async () => {
    // Mock successful session validation
    jest.spyOn(authService.session, 'validateSession').mockResolvedValue({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });

    const result = await authService.verifyAuth();

    expect(result).toEqual({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });
  });

  it('should require MFA when specified', async () => {
    jest.spyOn(authService.session, 'validateSession').mockResolvedValue({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: false, // MFA not verified
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });

    const result = await authService.verifyAuth({ requireMFA: true });

    expect(result).toBeNull();
  });

  it('should require specific roles', async () => {
    jest.spyOn(authService.session, 'validateSession').mockResolvedValue({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'], // Missing 'admin' role
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });

    const result = await authService.verifyAuth({ requireRoles: ['admin'] });

    expect(result).toBeNull();
  });

  it('should execute callback with auth context', async () => {
    const mockCallback = jest.fn().mockResolvedValue('success');

    jest.spyOn(authService.session, 'validateSession').mockResolvedValue({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });

    const result = await authService.withAuth(mockCallback);

    expect(result).toBe('success');
    expect(mockCallback).toHaveBeenCalledWith({
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      tenantId: '123e4567-e89b-12d3-a456-426614174002',
      mfaVerified: true,
      sessionId: 'session-id',
      correlationId: 'correlation-id',
    });
  });

  it('should return null for unauthenticated callback', async () => {
    const mockCallback = jest.fn();

    jest.spyOn(authService.session, 'validateSession').mockResolvedValue(null);

    const result = await authService.withAuth(mockCallback);

    expect(result).toBeNull();
    expect(mockCallback).not.toHaveBeenCalled();
  });
});

describe('Audit Logging Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auditLogger.clear();
  });

  it('should log authentication events', async () => {
    mockCookies.get.mockReturnValue({ value: 'some-token' });

    // Mock successful validation which should trigger a log entry
    jest.spyOn(TokenValidator.prototype, 'validate').mockResolvedValue({
      sub: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      roles: ['user'],
      org_id: 'tenant-1',
      mfa_verified: true,
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      jti: 'session-1',
    });

    const authService = new AuthService();
    await authService.verifyAuth();

    const entries = auditLogger.getEntries();
    expect(entries.length).toBeGreaterThan(0);

    const authEntry = entries.find((entry) => entry.action === 'session_validated');
    expect(authEntry).toBeDefined();
    expect(authEntry?.status).toBe('success');
  });
});
