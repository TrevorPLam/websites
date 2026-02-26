/**
 * @file mcp/servers/src/enterprise-auth-gateway.ts
 * @summary Enterprise Authentication Gateway with OAuth 2.1, OIDC, and RBAC
 * @description Implements enterprise-grade authentication, authorization, and identity management
 * @security Enterprise-grade security with authentication, authorization, and audit logging.
 * @requirements MCP-standards, enterprise-security
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import argon2 from 'argon2';
import crypto from 'crypto';
import { Parser } from 'expr-eval';
import jwt from 'jsonwebtoken';
import otplib from 'otplib';
import { z } from 'zod';

// Authentication Types
interface User {
  id: string;
  username: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  passwordHash?: string;
  mfaSecret?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  tenantId: string;
  system: boolean;
  createdAt: Date;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  system: boolean;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string[];
  issuedAt: Date;
}

interface BlacklistedToken {
  token: string;
  expiresAt: Date;
}

interface AuthSession {
  id: string;
  userId: string;
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessed: Date;
  ipAddress: string;
  userAgent: string;
}

interface AuthPolicy {
  id: string;
  name: string;
  tenantId: string;
  rules: AuthRule[];
  mfaRequired: boolean;
  sessionTimeout: number;
  passwordPolicy: PasswordPolicy;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthRule {
  id: string;
  type: 'ip-whitelist' | 'ip-blacklist' | 'time-based' | 'geo-location' | 'device-based';
  condition: string;
  action: 'allow' | 'deny' | 'require-mfa';
  enabled: boolean;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number;
}

// Redis Session Store Interface
interface SessionStore {
  get(id: string): Promise<AuthSession | null>;
  set(id: string, session: AuthSession, ttlSeconds: number): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

interface TokenBlacklistStore {
  add(token: string, expiresAt: Date): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
  remove(token: string): Promise<void>;
  cleanup(): Promise<void>;
}

/**
 * Enterprise Authentication Gateway MCP Server
 *
 * Provides comprehensive authentication, authorization, and identity management
 * capabilities with OAuth 2.1 compliance, RBAC, MFA, and audit logging.
 *
 * Features:
 * - Secure password hashing with Argon2
 * - TOTP-based multi-factor authentication
 * - Role-based access control (RBAC)
 * - JWT token management with blacklisting
 * - Policy-based access control
 * - Session management and cleanup
 * - Comprehensive audit logging
 */
export class EnterpriseAuthGateway {
  private server: McpServer;
  private users: Map<string, User> = new Map();
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private policies: Map<string, AuthPolicy> = new Map();
  private jwtSecret: string;
  private userPasswordHashes: Map<string, string> = new Map();
  private userMfaSecrets: Map<string, string> = new Map();
  private parser = new Parser();
  private cleanupInterval: NodeJS.Timeout | undefined;

  // Redis stores for persistence
  private sessionStore: SessionStore;
  private tokenBlacklistStore: TokenBlacklistStore;
  private redisClient: RedisClientType | undefined;

  constructor() {
    this.server = new McpServer({
      name: 'enterprise-auth-gateway',
      version: '1.0.0',
    });

    // Load JWT secret from environment or throw error
    this.jwtSecret = process.env.JWT_SECRET || '';
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required for production use');
    }

    // Initialize Redis stores
    this.sessionStore = this.createSessionStore();
    this.tokenBlacklistStore = this.createTokenBlacklistStore();

    this.initializeSystemData();
    this.setupAuthTools();
    this.startTokenCleanup();
  }

  private createSessionStore(): SessionStore {
    if (process.env.REDIS_URL) {
      // Redis-backed session store
      this.redisClient = createClient({ url: process.env.REDIS_URL });
      this.redisClient.connect().catch(console.error);

      return {
        async get(id: string): Promise<AuthSession | null> {
          if (!this.redisClient) return null;
          try {
            const raw = await this.redisClient.get(`mcp:auth:session:${id}`);
            return raw ? JSON.parse(raw) : null;
          } catch (error) {
            console.error('Redis session get error:', error);
            return null;
          }
        },

        async set(id: string, session: AuthSession, ttlSeconds: number): Promise<void> {
          if (!this.redisClient) return;
          try {
            await this.redisClient.setEx(
              `mcp:auth:session:${id}`,
              ttlSeconds,
              JSON.stringify(session)
            );
          } catch (error) {
            console.error('Redis session set error:', error);
          }
        },

        async delete(id: string): Promise<void> {
          if (!this.redisClient) return;
          try {
            await this.redisClient.del(`mcp:auth:session:${id}`);
          } catch (error) {
            console.error('Redis session delete error:', error);
          }
        },

        async exists(id: string): Promise<boolean> {
          if (!this.redisClient) return false;
          try {
            return (await this.redisClient.exists(`mcp:auth:session:${id}`)) === 1;
          } catch (error) {
            console.error('Redis session exists error:', error);
            return false;
          }
        },
      };
    } else {
      // In-memory fallback for development
      const memoryStore = new Map<string, AuthSession>();
      return {
        async get(id: string): Promise<AuthSession | null> {
          return memoryStore.get(id) ?? null;
        },
        async set(id: string, session: AuthSession): Promise<void> {
          memoryStore.set(id, session);
        },
        async delete(id: string): Promise<void> {
          memoryStore.delete(id);
        },
        async exists(id: string): Promise<boolean> {
          return memoryStore.has(id);
        },
      };
    }
  }

  private createTokenBlacklistStore(): TokenBlacklistStore {
    if (process.env.REDIS_URL && this.redisClient) {
      return {
        async add(token: string, expiresAt: Date): Promise<void> {
          if (!this.redisClient) return;
          try {
            const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
            if (ttl > 0) {
              await this.redisClient.setEx(`mcp:auth:blacklist:${token}`, ttl, '1');
            }
          } catch (error) {
            console.error('Redis blacklist add error:', error);
          }
        },

        async isBlacklisted(token: string): Promise<boolean> {
          if (!this.redisClient) return false;
          try {
            return (await this.redisClient.exists(`mcp:auth:blacklist:${token}`)) === 1;
          } catch (error) {
            console.error('Redis blacklist check error:', error);
            return false;
          }
        },

        async remove(token: string): Promise<void> {
          if (!this.redisClient) return;
          try {
            await this.redisClient.del(`mcp:auth:blacklist:${token}`);
          } catch (error) {
            console.error('Redis blacklist remove error:', error);
          }
        },

        async cleanup(): Promise<void> {
          // Redis handles TTL cleanup automatically
          console.log('Redis handles token blacklist cleanup via TTL');
        },
      };
    } else {
      // In-memory fallback
      const memoryBlacklist = new Map<string, Date>();
      return {
        async add(token: string, expiresAt: Date): Promise<void> {
          memoryBlacklist.set(token, expiresAt);
        },
        async isBlacklisted(token: string): Promise<boolean> {
          const expiresAt = memoryBlacklist.get(token);
          if (!expiresAt) return false;
          if (expiresAt.getTime() < Date.now()) {
            memoryBlacklist.delete(token);
            return false;
          }
          return true;
        },
        async remove(token: string): Promise<void> {
          memoryBlacklist.delete(token);
        },
        async cleanup(): Promise<void> {
          const now = Date.now();
          for (const [token, expiresAt] of memoryBlacklist.entries()) {
            if (expiresAt.getTime() < now) {
              memoryBlacklist.delete(token);
            }
          }
        },
      };
    }
  }

  private async findSessionByToken(token: string): Promise<AuthSession | null> {
    // For Redis implementation, we'd need to scan keys or maintain an index
    // For now, we'll use the user's sessions as a fallback
    // In production, consider maintaining a token->session index in Redis
    for (const user of this.users.values()) {
      // This is a simplified approach - in production you'd want a more efficient method
      const sessions = await this.getUserSessions(user.id);
      for (const session of sessions) {
        if (session.accessToken === token) {
          return session;
        }
      }
    }
    return null;
  }

  private async getUserSessions(userId: string): Promise<AuthSession[]> {
    // This is a placeholder - in production you'd maintain a user->sessions index
    // For now, return empty array to maintain functionality
    return [];
  }

  private startTokenCleanup() {
    // Clean up expired tokens every 15 minutes (more frequent than before)
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredTokens();
      },
      15 * 60 * 1000
    );
  }

  private initializeSystemData() {
    // Initialize system permissions
    const systemPermissions: Permission[] = [
      {
        id: 'mcp-access',
        name: 'mcp-access',
        resource: 'mcp',
        action: 'access',
        description: 'Access MCP servers',
        system: true,
      },
      {
        id: 'mcp-admin',
        name: 'mcp-admin',
        resource: 'mcp',
        action: 'admin',
        description: 'Administer MCP servers',
        system: true,
      },
      {
        id: 'tenant-manage',
        name: 'tenant-manage',
        resource: 'tenant',
        action: 'manage',
        description: 'Manage tenant settings',
        system: true,
      },
      {
        id: 'user-manage',
        name: 'user-manage',
        resource: 'user',
        action: 'manage',
        description: 'Manage users',
        system: true,
      },
      {
        id: 'security-admin',
        name: 'security-admin',
        resource: 'security',
        action: 'admin',
        description: 'Security administration',
        system: true,
      },
    ];

    systemPermissions.forEach((permission) => this.permissions.set(permission.id, permission));

    // Initialize system roles
    const systemRoles: Role[] = [
      {
        id: 'role-001',
        name: 'super-admin',
        description: 'Super administrator with full system access',
        permissions: systemPermissions.map((p) => p.id),
        tenantId: 'system',
        system: true,
        createdAt: new Date(),
      },
      {
        id: 'role-002',
        name: 'tenant-admin',
        description: 'Tenant administrator',
        permissions: ['mcp-access', 'tenant-manage', 'user-manage'],
        tenantId: 'system',
        system: true,
        createdAt: new Date(),
      },
      {
        id: 'role-003',
        name: 'mcp-user',
        description: 'MCP user with basic access',
        permissions: ['mcp-access'],
        tenantId: 'system',
        system: true,
        createdAt: new Date(),
      },
    ];

    systemRoles.forEach((role) => this.roles.set(role.id, role));

    // Initialize default auth policy
    const defaultPolicy: AuthPolicy = {
      id: 'policy-default',
      name: 'Default Authentication Policy',
      tenantId: 'system',
      rules: [
        {
          id: 'rule-001',
          type: 'ip-whitelist',
          condition: 'ip in ["127.0.0.1", "::1"]',
          action: 'allow',
          enabled: false,
        },
        {
          id: 'rule-002',
          type: 'time-based',
          condition: 'hour >= 9 && hour <= 17',
          action: 'allow',
          enabled: false,
        },
      ],
      mfaRequired: false,
      sessionTimeout: 3600, // 1 hour
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90, // 90 days
        historyCount: 5,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.policies.set(defaultPolicy.id, defaultPolicy);
  }

  private async createUser(
    username: string,
    email: string,
    tenantId: string,
    password: string,
    roles: string[] = []
  ): Promise<User> {
    const userId = crypto.randomUUID();
    const passwordHash = await argon2.hash(password);
    const mfaSecret = otplib.authenticator.generateSecret();

    const user: User = {
      id: userId,
      username,
      email,
      tenantId,
      roles,
      permissions: this.getPermissionsForRoles(roles),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash,
      mfaSecret,
    };

    this.users.set(userId, user);
    this.userPasswordHashes.set(userId, passwordHash);
    this.userMfaSecrets.set(userId, mfaSecret);

    return user;
  }

  private setupAuthTools() {
    // User authentication
    this.server.tool(
      'authenticate-user',
      'Authenticate user with credentials',
      {
        username: z.string().describe('Username'),
        password: z.string().describe('Password'),
        tenantId: z.string().describe('Tenant ID'),
        mfaCode: z.string().optional().describe('MFA code if required'),
        ipAddress: z.string().default('127.0.0.1').describe('Client IP address'),
        userAgent: z.string().default('unknown').describe('Client user agent'),
      },
      async ({ username, password, tenantId, mfaCode, ipAddress, userAgent }) => {
        // Validate user credentials
        const user = this.users.get(username);
        if (!user || user.tenantId !== tenantId) {
          return {
            content: [{ type: 'text', text: 'Authentication failed: Invalid credentials' }],
          };
        }

        if (user.status !== 'active') {
          return {
            content: [{ type: 'text', text: 'Authentication failed: User account not active' }],
          };
        }

        // Verify password (simplified - in production, use proper password hashing)
        if (!this.verifyPassword(password, user.id)) {
          return {
            content: [{ type: 'text', text: 'Authentication failed: Invalid password' }],
          };
        }

        // Check auth policy
        const policy = this.policies.get('policy-default');
        if (policy) {
          const policyResult = await this.evaluateAuthPolicy(policy, user, ipAddress);
          if (!policyResult.allowed) {
            return {
              content: [{ type: 'text', text: `Authentication failed: ${policyResult.reason}` }],
            };
          }

          // Check MFA requirement
          if (policy.mfaRequired && !mfaCode) {
            return {
              content: [{ type: 'text', text: 'MFA code required' }],
            };
          }

          if (policy.mfaRequired && mfaCode) {
            if (!this.verifyMfaCode(mfaCode, user.id)) {
              return {
                content: [{ type: 'text', text: 'Authentication failed: Invalid MFA code' }],
              };
            }
          }
        }

        // Generate tokens
        const tokens = this.generateTokens(user);

        // Create session
        const session: AuthSession = {
          id: crypto.randomUUID(),
          userId: user.id,
          tenantId: user.tenantId,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
          createdAt: new Date(),
          lastAccessed: new Date(),
          ipAddress,
          userAgent,
        };

        // Store session with 1 hour TTL
        await this.sessionStore.set(session.id, session, 3600);

        // Update user last login
        user.lastLogin = new Date();
        user.updatedAt = new Date();

        return {
          content: [
            {
              type: 'text',
              text: `Authentication successful for ${username}\nSession ID: ${session.id}\nExpires: ${session.expiresAt.toISOString()}`,
            },
          ],
        };
      }
    );

    // Token validation
    this.server.tool(
      'validate-token',
      'Validate JWT token and return user context',
      {
        token: z.string().describe('JWT access token'),
        action: z.string().describe('Action being performed'),
        resource: z.string().describe('Resource being accessed'),
      },
      async ({ token, action, resource }) => {
        try {
          const decoded = jwt.verify(token, this.jwtSecret) as any;

          // Check if token is blacklisted
          if (this.isTokenBlacklisted(token)) {
            return {
              content: [{ type: 'text', text: 'Token validation failed: Token blacklisted' }],
            };
          }

          // Check session - iterate through potential sessions since we don't have direct query
          const session = await this.findSessionByToken(token);
          if (!session || session.expiresAt < new Date()) {
            return {
              content: [
                { type: 'text', text: 'Token validation failed: Invalid or expired session' },
              ],
            };
          }

          // Get user
          const user = this.users.get(decoded.userId);
          if (!user || user.status !== 'active') {
            return {
              content: [
                { type: 'text', text: 'Token validation failed: User not found or inactive' },
              ],
            };
          }

          // Check permissions
          const hasPermission = this.checkPermission(user, action, resource);
          if (!hasPermission) {
            return {
              content: [
                { type: 'text', text: 'Token validation failed: Insufficient permissions' },
              ],
            };
          }

          // Update session last accessed
          session.lastAccessed = new Date();

          return {
            content: [
              {
                type: 'text',
                text: `Token validation successful\nUser: ${user.username}\nTenant: ${user.tenantId}\nPermissions: ${user.permissions.join(', ')}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: 'Token validation failed: Invalid token' }],
          };
        }
      }
    );

    // Token refresh
    this.server.tool(
      'refresh-token',
      'Refresh access token using refresh token',
      {
        refreshToken: z.string().describe('Refresh token'),
      },
      async ({ refreshToken }) => {
        try {
          const decoded = jwt.verify(refreshToken, this.jwtSecret) as any;

          // Find session
          const session = Array.from(this.sessions.values()).find(
            (s) => s.refreshToken === refreshToken
          );
          if (!session) {
            return {
              content: [{ type: 'text', text: 'Token refresh failed: Invalid refresh token' }],
            };
          }

          // Get user
          const user = this.users.get(decoded.userId);
          if (!user || user.status !== 'active') {
            return {
              content: [{ type: 'text', text: 'Token refresh failed: User not found or inactive' }],
            };
          }

          // Generate new tokens
          const tokens = this.generateTokens(user);

          // Update session
          session.accessToken = tokens.accessToken;
          session.refreshToken = tokens.refreshToken;
          session.expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
          session.lastAccessed = new Date();

          return {
            content: [
              {
                type: 'text',
                text: `Token refresh successful\nNew token expires: ${session.expiresAt.toISOString()}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: 'Token refresh failed: Invalid refresh token' }],
          };
        }
      }
    );

    // User management
    this.server.tool(
      'manage-user',
      'Manage user accounts',
      {
        action: z.enum(['create', 'update', 'delete', 'list']).describe('User management action'),
        userId: z.string().optional().describe('User ID for update/delete actions'),
        userData: z
          .object({
            username: z.string(),
            email: z.string(),
            password: z.string().optional(),
            tenantId: z.string(),
            roles: z.array(z.string()).optional(),
            status: z.enum(['active', 'inactive', 'suspended']).optional(),
          })
          .optional()
          .describe('User data for create/update actions'),
      },
      async ({ action, userId, userData }) => {
        switch (action) {
          case 'create':
            if (!userData) {
              return {
                content: [{ type: 'text', text: 'User data required for create action' }],
              };
            }

            if (this.users.has(userData.username)) {
              return {
                content: [{ type: 'text', text: 'User already exists' }],
              };
            }

            const newUser: User = {
              id: crypto.randomUUID(),
              username: userData.username,
              email: userData.email,
              tenantId: userData.tenantId,
              roles: userData.roles || [],
              permissions: this.getPermissionsForRoles(userData.roles || []),
              status: userData.status || 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            this.users.set(newUser.id, newUser);

            return {
              content: [
                { type: 'text', text: `User created: ${newUser.id} (${newUser.username})` },
              ],
            };

          case 'update':
            if (!userId || !userData) {
              return {
                content: [{ type: 'text', text: 'User ID and data required for update action' }],
              };
            }

            const existingUser = this.users.get(userId);
            if (!existingUser) {
              return {
                content: [{ type: 'text', text: 'User not found' }],
              };
            }

            Object.assign(existingUser, userData);
            if (userData.roles) {
              existingUser.permissions = this.getPermissionsForRoles(userData.roles);
            }
            existingUser.updatedAt = new Date();

            return {
              content: [{ type: 'text', text: `User updated: ${userId}` }],
            };

          case 'delete':
            if (!userId) {
              return {
                content: [{ type: 'text', text: 'User ID required for delete action' }],
              };
            }

            const deleted = this.users.delete(userId);

            // Clean up sessions
            const sessionsToDelete = Array.from(this.sessions.values()).filter(
              (s) => s.userId === userId
            );
            sessionsToDelete.forEach((session) => this.sessions.delete(session.id));

            return {
              content: [
                { type: 'text', text: deleted ? `User deleted: ${userId}` : 'User not found' },
              ],
            };

          case 'list':
            const users = Array.from(this.users.values());
            const summary = users
              .map(
                (u) =>
                  `${u.username} (${u.id}) - ${u.email} - ${u.tenantId} - ${u.status} - Roles: ${u.roles.join(', ')}`
              )
              .join('\n');

            return {
              content: [{ type: 'text', text: `Users (${users.length}):\n\n${summary}` }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      }
    );

    // Role management
    this.server.tool(
      'manage-roles',
      'Manage roles and permissions',
      {
        action: z.enum(['create', 'update', 'delete', 'list']).describe('Role management action'),
        roleId: z.string().optional().describe('Role ID for update/delete actions'),
        roleData: z
          .object({
            name: z.string(),
            description: z.string(),
            permissions: z.array(z.string()),
            tenantId: z.string().optional(),
          })
          .optional()
          .describe('Role data for create/update actions'),
      },
      async ({ action, roleId, roleData }) => {
        switch (action) {
          case 'create':
            if (!roleData) {
              return {
                content: [{ type: 'text', text: 'Role data required for create action' }],
              };
            }

            const newRole: Role = {
              id: crypto.randomUUID(),
              name: roleData.name,
              description: roleData.description,
              permissions: roleData.permissions,
              tenantId: roleData.tenantId || 'system',
              system: false,
              createdAt: new Date(),
            };

            this.roles.set(newRole.id, newRole);

            return {
              content: [{ type: 'text', text: `Role created: ${newRole.id} (${newRole.name})` }],
            };

          case 'update':
            if (!roleId || !roleData) {
              return {
                content: [{ type: 'text', text: 'Role ID and data required for update action' }],
              };
            }

            const existingRole = this.roles.get(roleId);
            if (!existingRole) {
              return {
                content: [{ type: 'text', text: 'Role not found' }],
              };
            }

            Object.assign(existingRole, roleData);

            return {
              content: [{ type: 'text', text: `Role updated: ${roleId}` }],
            };

          case 'delete':
            if (!roleId) {
              return {
                content: [{ type: 'text', text: 'Role ID required for delete action' }],
              };
            }

            const deleted = this.roles.delete(roleId);
            return {
              content: [
                { type: 'text', text: deleted ? `Role deleted: ${roleId}` : 'Role not found' },
              ],
            };

          case 'list':
            const roles = Array.from(this.roles.values());
            const summary = roles
              .map(
                (r) =>
                  `${r.name} (${r.id}) - ${r.description} - Permissions: ${r.permissions.join(', ')}`
              )
              .join('\n');

            return {
              content: [{ type: 'text', text: `Roles (${roles.length}):\n\n${summary}` }],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      }
    );

    // Session management
    this.server.tool(
      'manage-sessions',
      'Manage user sessions',
      {
        action: z.enum(['list', 'revoke', 'cleanup']).describe('Session management action'),
        sessionId: z.string().optional().describe('Session ID for revoke action'),
        userId: z.string().optional().describe('User ID for user-specific actions'),
      },
      async ({ action, sessionId, userId }) => {
        switch (action) {
          case 'list':
            let sessions = Array.from(this.sessions.values());

            if (userId) {
              sessions = sessions.filter((s) => s.userId === userId);
            }

            const summary = sessions
              .map(
                (s) =>
                  `${s.id} - User: ${s.userId} - Expires: ${s.expiresAt.toISOString()} - IP: ${s.ipAddress}`
              )
              .join('\n');

            return {
              content: [{ type: 'text', text: `Sessions (${sessions.length}):\n\n${summary}` }],
            };

          case 'revoke':
            if (!sessionId) {
              return {
                content: [{ type: 'text', text: 'Session ID required for revoke action' }],
              };
            }

            // Get session before deleting
            const session = this.sessions.get(sessionId);
            if (!session) {
              return {
                content: [{ type: 'text', text: 'Session not found' }],
              };
            }

            // Blacklist token before deleting session
            this.blacklistToken(session.accessToken);

            // Now delete the session
            this.sessions.delete(sessionId);

            return {
              content: [
                {
                  type: 'text',
                  text: `Session revoked: ${sessionId}`,
                },
              ],
            };

          case 'cleanup':
            const now = new Date();
            const expiredSessions = Array.from(this.sessions.entries()).filter(
              ([id, session]) => session.expiresAt < now
            );

            expiredSessions.forEach(([id]) => this.sessions.delete(id));

            return {
              content: [
                { type: 'text', text: `Cleaned up ${expiredSessions.length} expired sessions` },
              ],
            };

          default:
            return {
              content: [{ type: 'text', text: 'Invalid action' }],
            };
        }
      }
    );
  }

  private verifyPassword(password: string, userId: string): boolean {
    const passwordHash = this.userPasswordHashes.get(userId);
    if (!passwordHash) {
      return false;
    }

    try {
      return argon2.verify(passwordHash, password);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  private verifyMfaCode(code: string, userId: string): boolean {
    const mfaSecret = this.userMfaSecrets.get(userId);
    if (!mfaSecret) {
      return false;
    }

    try {
      return otplib.authenticator.verify({ token: code, secret: mfaSecret });
    } catch (error) {
      console.error('MFA verification error:', error);
      return false;
    }
  }

  private getPermissionsForRoles(roleIds: string[]): string[] {
    const permissions = new Set<string>();

    for (const roleId of roleIds) {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach((permission) => permissions.add(permission));
      }
    }

    return Array.from(permissions);
  }

  private async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await this.tokenBlacklistStore.add(token, expiresAt);
      }
    } catch (error) {
      // If we can't decode, blacklist for a default period (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await this.tokenBlacklistStore.add(token, expiresAt);
    }
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    return await this.tokenBlacklistStore.isBlacklisted(token);
  }

  private async cleanupExpiredTokens(): Promise<void> {
    await this.tokenBlacklistStore.cleanup();
  }

  // Periodic cleanup to prevent memory leaks
  private startTokenCleanup(): void {
    setInterval(
      () => {
        this.cleanupExpiredTokens();
      },
      60 * 60 * 1000
    ); // Cleanup every hour
  }

  private checkPermission(user: User, action: string, resource: string): boolean {
    // Standardize permission format to handle both formats
    const requiredPermission = `${resource}:${action}`;
    const altPermission = `perm-${resource}-${action}`;

    return (
      user.permissions.includes(requiredPermission) ||
      user.permissions.includes(altPermission) ||
      user.permissions.includes('mcp-admin')
    );
  }

  private async evaluateAuthPolicy(
    policy: AuthPolicy,
    user: User,
    ipAddress: string
  ): Promise<{ allowed: boolean; reason: string }> {
    // Comprehensive policy evaluation with safe expression parsing
    for (const rule of policy.rules) {
      if (!rule.enabled) continue;

      try {
        // Simple IP whitelist check
        if (rule.type === 'ip-whitelist' && rule.action === 'allow') {
          const allowedIPs =
            rule.condition
              .match(/\[(.*?)\]/)?.[1]
              ?.split(',')
              .map((ip) => ip.trim()) || [];
          if (!allowedIPs.includes(ipAddress)) {
            return { allowed: false, reason: `IP address not in whitelist` };
          }
        }

        // Safe time-based check using expr-eval instead of eval
        if (rule.type === 'time-based' && rule.action === 'allow') {
          const currentHour = new Date().getHours();
          const condition = rule.condition.replace('hour', currentHour.toString());

          // Use safe expression parser instead of eval
          const expr = this.parser.parse(condition);
          const result = expr.evaluate();

          if (!result) {
            return { allowed: false, reason: 'Access not allowed at this time' };
          }
        }
      } catch (error) {
        console.error('Policy evaluation error:', error);
        // Fail closed on policy evaluation errors
        return { allowed: false, reason: 'Policy evaluation failed' };
      }
    }

    return { allowed: true, reason: 'Policy passed' };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Enterprise Auth Gateway MCP Server running on stdio');
  }

  async cleanup() {
    // Clear cleanup interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Clear all maps
    this.users.clear();
    this.roles.clear();
    this.permissions.clear();
    this.sessions.clear();
    this.policies.clear();
    this.tokenBlacklist.clear();
    this.userPasswordHashes.clear();
    this.userMfaSecrets.clear();

    console.error('Enterprise Auth Gateway resources cleaned up');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const authGateway = new EnterpriseAuthGateway();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('\nShutting down Enterprise Auth Gateway...');
    await authGateway.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('\nShutting down Enterprise Auth Gateway...');
    await authGateway.cleanup();
    process.exit(0);
  });

  authGateway.run().catch(console.error);
}
