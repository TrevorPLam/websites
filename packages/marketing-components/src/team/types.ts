/**
 * @file packages/marketing-components/src/team/types.ts
 * @role types
 * @summary Shared types for team component variants
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar?: string;
  photo?: {
    src: string;
    alt: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
  /** @deprecated Use socialLinks */
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface TeamFilter {
  role?: string;
  department?: string;
}
