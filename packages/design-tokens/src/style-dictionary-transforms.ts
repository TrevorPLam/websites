/**
 * @file packages/design-tokens/src/style-dictionary-transforms.ts
 * @summary Custom Style Dictionary transforms for multi-platform design token conversion.
 * @description Converts design tokens to CSS, SCSS, LESS, and other platform-specific formats with validation.
 * @security No sensitive data processing; read-only token transformations.
 * @adr docs/architecture/decisions/ADR-004-design-tokens.md
 * @requirements DESIGN-001, TOKEN-TRANSFORM-001
 */
/**
 * Style Dictionary Transforms
 * 
 * Custom transforms for Style Dictionary to convert design tokens
 * to various platform-specific formats (CSS, SCSS, LESS, etc.)
 */

import { Transform } from 'style-dictionary/types';

// HSL color transform
export const hslColorTransform: Transform = {
  name: 'color/hsl',
  type: 'value',
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'string' && value.match(/^\d+\s+\d+%\s+\d+%$/)) {
      return `hsl(${value})`;
    }
    return value;
  },
};

// HSL color transform with alpha
export const hslColorAlphaTransform: Transform = {
  name: 'color/hslAlpha',
  type: 'value',
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'string' && value.match(/^\d+\s+\d+%\s+\d+%$/)) {
      return `hsl(${value} / <alpha>)`;
    }
    return value;
  },
};

// CSS variable transform
export const cssVariableTransform: Transform = {
  name: 'name/cssVariable',
  type: 'name',
  matcher: () => true,
  transformer: (token) => {
    const path = token.path.join('-');
    return `--${path}`;
  },
};

// CSS variable reference transform
export const cssVariableReferenceTransform: Transform = {
  name: 'cssVariableReference',
  type: 'value',
  matcher: (token) => token.type === 'color' || token.type === 'dimension',
  transformer: (token) => {
    const path = token.path.join('-');
    return `var(--${path})`;
  },
};

// Typography transform for CSS
export const typographyTransform: Transform = {
  name: 'typography/css',
  type: 'value',
  matcher: (token) => token.type === 'typography',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'object') {
      const fontFamily = value.fontFamily?.join(', ') || 'inherit';
      const fontSize = value.fontSize || '1rem';
      const fontWeight = value.fontWeight || 'normal';
      const lineHeight = value.lineHeight || 'normal';
      const letterSpacing = value.letterSpacing || 'normal';
      
      return {
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
      };
    }
    return value;
  },
};

// Shadow transform for CSS
export const shadowTransform: Transform = {
  name: 'shadow/css',
  type: 'value',
  matcher: (token) => token.type === 'shadow',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value.x !== undefined) {
      const { x, y, blur, spread, color, inset } = value;
      const shadowParts = [
        inset ? 'inset' : '',
        `${x}px`,
        `${y}px`,
        `${blur}px`,
        `${spread}px`,
        color || 'transparent',
      ].filter(Boolean);
      
      return shadowParts.join(' ');
    }
    return value;
  },
};

// Border radius transform
export const borderRadiusTransform: Transform = {
  name: 'borderRadius/css',
  type: 'value',
  matcher: (token) => token.type === 'borderRadius',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'string' && value === 'full') {
      return '9999px';
    }
    return value;
  },
};

// Spacing transform for CSS
export const spacingTransform: Transform = {
  name: 'spacing/css',
  type: 'value',
  matcher: (token) => token.type === 'dimension',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'number') {
      return `${value}px`;
    }
    if (typeof value === 'string') {
      // Convert rem to px if needed
      if (value.endsWith('rem')) {
        return value;
      }
      if (value.endsWith('px')) {
        return value;
      }
      // Assume rem for unitless values
      return `${value}rem`;
    }
    return value;
  },
};

// Font size transform with clamp
export const fontSizeClampTransform: Transform = {
  name: 'fontSize/clamp',
  type: 'value',
  matcher: (token) => token.type === 'fontSize',
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'object' && value.clamp) {
      const { min, preferred, max } = value.clamp;
      return `clamp(${min}, ${preferred}, ${max})`;
    }
    return value;
  },
};

// Responsive spacing transform
export const responsiveSpacingTransform: Transform = {
  name: 'spacing/responsive',
  type: 'value',
  matcher: (token) => token.type === 'dimension' && token.value?.responsive,
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'object' && value.responsive) {
      const { mobile, tablet, desktop } = value.responsive;
      return {
        mobile,
        tablet,
        desktop,
      };
    }
    return value;
  },
};

// SCSS map transform
export const scssMapTransform: Transform = {
  name: 'scss/map',
  type: 'value',
  matcher: () => true,
  transformer: (token) => {
    const value = token.value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Convert object to SCSS map format
      const entries = Object.entries(value).map(([key, val]) => {
        return `  '${key}': ${JSON.stringify(val)}`;
      });
      return `(\n${entries.join(',\n')}\n)`;
    }
    return value;
  },
};

// LESS variable transform
export const lessVariableTransform: Transform = {
  name: 'less/variable',
  type: 'name',
  matcher: () => true,
  transformer: (token) => {
    const path = token.path.join('-');
    return `@${path}`;
  },
};

// LESS variable reference transform
export const lessVariableReferenceTransform: Transform = {
  name: 'lessVariableReference',
  type: 'value',
  matcher: (token) => token.type === 'color' || token.type === 'dimension',
  transformer: (token) => {
    const path = token.path.join('-');
    return `@${path}`;
  },
};

// JavaScript/TypeScript object transform
export const jsObjectTransform: Transform = {
  name: 'js/object',
  type: 'value',
  matcher: () => true,
  transformer: (token) => {
    const value = token.value;
    return JSON.stringify(value, null, 2);
  },
};

// JavaScript constant transform
export const jsConstantTransform: Transform = {
  name: 'js/constant',
  type: 'name',
  matcher: () => true,
  transformer: (token) => {
    const path = token.path.map(part => {
      // Convert kebab-case to camelCase
      return part.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    });
    return path.join('');
  },
};

// Android XML transform
export const androidXmlTransform: Transform = {
  name: 'android/xml',
  type: 'value',
  matcher: (token) => token.type === 'color' || token.type === 'dimension',
  transformer: (token) => {
    const value = token.value;
    if (token.type === 'color') {
      if (typeof value === 'string' && value.match(/^\d+\s+\d+%\s+\d+%$/)) {
        // Convert HSL to Android color format
        const [h, s, l] = value.split(' ').map(Number);
        // Convert HSL to RGB (simplified)
        const rgb = hslToRgb(h, s / 100, l / 100);
        return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
      }
      return value;
    }
    if (token.type === 'dimension') {
      if (typeof value === 'number') {
        return `${value}dp`;
      }
      if (typeof value === 'string') {
        if (value.endsWith('px')) return value.replace('px', 'dp');
        if (value.endsWith('rem')) return value.replace('rem', 'sp');
      }
    }
    return value;
  },
};

// iOS Swift transform
export const iosSwiftTransform: Transform = {
  name: 'ios/swift',
  type: 'value',
  matcher: (token) => token.type === 'color' || token.type === 'dimension',
  transformer: (token) => {
    const value = token.value;
    if (token.type === 'color') {
      if (typeof value === 'string' && value.match(/^\d+\s+\d+%\s+\d+%$/)) {
        // Convert HSL to UIColor
        const [h, s, l] = value.split(' ').map(Number);
        const rgb = hslToRgb(h, s / 100, l / 100);
        return `UIColor(red: ${rgb[0] / 255}, green: ${rgb[1] / 255}, blue: ${rgb[2] / 255}, alpha: 1.0)`;
      }
      return value;
    }
    if (token.type === 'dimension') {
      if (typeof value === 'number') {
        return `CGFloat(${value})`;
      }
      if (typeof value === 'string') {
        if (value.endsWith('px')) return `CGFloat(${value.replace('px', '')})`;
        if (value.endsWith('rem')) return `CGFloat(${value.replace('rem', '')} * 16)`;
      }
    }
    return value;
  },
};

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Export all transforms as an object
export const styleDictionaryTransforms = {
  // Color transforms
  'color/hsl': hslColorTransform,
  'color/hslAlpha': hslColorAlphaTransform,
  
  // Name transforms
  'name/cssVariable': cssVariableTransform,
  'name/lessVariable': lessVariableTransform,
  'name/jsConstant': jsConstantTransform,
  
  // Value transforms
  'cssVariableReference': cssVariableReferenceTransform,
  'typography/css': typographyTransform,
  'shadow/css': shadowTransform,
  'borderRadius/css': borderRadiusTransform,
  'spacing/css': spacingTransform,
  'fontSize/clamp': fontSizeClampTransform,
  'spacing/responsive': responsiveSpacingTransform,
  'scss/map': scssMapTransform,
  'lessVariableReference': lessVariableReferenceTransform,
  'js/object': jsObjectTransform,
  'android/xml': androidXmlTransform,
  'ios/swift': iosSwiftTransform,
} as const;

// Export types
export type StyleDictionaryTransforms = typeof styleDictionaryTransforms;

// Default export
export default styleDictionaryTransforms;
