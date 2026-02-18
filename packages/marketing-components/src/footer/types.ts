/**
 * @file packages/marketing-components/src/footer/types.ts
 * @role types
 * @summary Shared footer types — compatible with @repo/types
 */

/** Footer link — compatible with NavLink from @repo/types */
export interface FooterLink {
  id?: string;
  label: string;
  href: string;
  category?: string;
}

/** Footer column with heading and links */
export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

/** Social link — compatible with SocialLink from @repo/types */
export interface FooterSocialLink {
  id?: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';
  href: string;
  label?: string;
}
