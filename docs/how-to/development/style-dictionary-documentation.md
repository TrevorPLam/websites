---
title: "style-dictionary-documentation.md"
description: "Official Amazon Style Dictionary documentation for token transformation, configuration, and cross-platform code generation as of February 2026."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "style-dictionary-documentation.md"]
legacy_path: "standards-specs\style-dictionary-documentation.md"
---
# style-dictionary-documentation.md

Official Amazon Style Dictionary documentation for token transformation, configuration, and cross-platform code generation as of February 2026.

## Overview

Style Dictionary is a build system for creating and managing cross-platform styles from design tokens. It transforms design tokens into platform-specific code for iOS, Android, CSS, JavaScript, and other platforms, ensuring consistency across all products.

## Key Features

### Cross-Platform Support

- **iOS**: Swift and Objective-C code generation
- **Android**: Kotlin and Java resource generation
- **Web**: CSS, SCSS, LESS, and JavaScript variables
- **React**: TypeScript and JavaScript integration
- **Flutter**: Dart code generation
- **Design Tools**: Sketch files and documentation

### DTCG Compatibility

- **Forward-compatible** with Design Tokens Community Group specification
- **Format conversion** tools for migrating to DTCG format
- **Mixed format support** during transition periods
- **First-class DTCG support** in version 4+

### Advanced Transformation Pipeline

- **Custom transforms** for any platform-specific needs
- **Transform groups** for common platform configurations
- **Transitive transforms** for complex token relationships
- **Reference resolution** with circular dependency detection

## Installation

### Global Installation (CLI)

```bash
npm install -g style-dictionary
```

### Project Installation

```bash
# npm
npm install -D style-dictionary

# yarn
yarn add style-dictionary --dev

# pnpm
pnpm add -D style-dictionary
```

### Quick Start

```bash
# Initialize a new project
style-dictionary init basic

# Build all platforms
style-dictionary build
```

## Configuration

### Basic Configuration File

Create a `config.json` in your project root:

```json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "variables.scss",
          "format": "scss/variables"
        }
      ]
    }
  }
}
```

### Advanced Configuration

```javascript
const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/**/*.json'],
  include: ['core-tokens/**/*.json'],

  platforms: {
    web: {
      transformGroup: 'web',
      buildPath: 'build/web/',
      preprocessors: ['my-preprocessor'],
      transforms: ['custom-transform'],
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          filter: (token) => token.category === 'color',
        },
      ],
    },

    ios: {
      transformGroup: 'ios',
      buildPath: 'build/ios/',
      options: {
        fileHeader: 'iOS Custom Header',
        outputReferences: true,
      },
      files: [
        {
          destination: 'StyleDictionaryColor.swift',
          format: 'ios-swift/class.swift',
          className: 'StyleDictionaryColor',
        },
      ],
    },
  },
});

StyleDictionary.buildAllPlatforms();
```

## Design Token Structure

### Category/Type/Item (CTI) Structure

Style Dictionary recommends organizing tokens using the CTI pattern:

```json
{
  "color": {
    "background": {
      "primary": {
        "value": "#ffffff",
        "comment": "Primary background color"
      },
      "secondary": {
        "value": "#f8f9fa",
        "comment": "Secondary background color"
      }
    },
    "text": {
      "primary": {
        "value": "#212529",
        "comment": "Primary text color"
      }
    }
  },
  "size": {
    "font": {
      "small": {
        "value": "12px",
        "comment": "Small font size"
      },
      "base": {
        "value": "16px",
        "comment": "Base font size"
      }
    }
  }
}
```

### DTCG Format Support

Style Dictionary v4+ supports the DTCG format:

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.2, 0.4, 0.8]
      },
      "$description": "Primary brand color"
    }
  }
}
```

### Token Properties

**Standard Format:**

- `value`: The token's value
- `type`: Token type (optional, inferred from CTI)
- `comment`: Human-readable description

**DTCG Format:**

- `$value`: The token's value
- `$type`: Token type (required)
- `$description`: Human-readable description

## Transforms

### Built-in Transforms

#### Color Transforms

- `color/hex`: Convert to hex format (#RRGGBB)
- `color/rgb`: Convert to RGB format (rgb(r, g, b))
- `color/rgba`: Convert to RGBA format with alpha
- `color/hex8`: Convert to 8-digit hex (#RRGGBBAA)
- `color/hsl`: Convert to HSL format
- `color/lch`: Convert to LCH format (modern CSS)
- `color/oklch`: Convert to Oklch format (perceptual)

#### Size/Dimension Transforms

- `size/px`: Convert to pixels
- `size/rem`: Convert to rem units
- `size/em`: Convert to em units
- `size/pt`: Convert to points (iOS)
- `size/dp`: Convert to density-independent pixels (Android)

#### Font Transforms

- `font/css`: Convert to CSS font family
- `font/ios`: Convert to iOS font family
- `font/android`: Convert to Android font family

#### Time Transforms

- `time/seconds`: Convert to seconds
- `time/milliseconds`: Convert to milliseconds

### Custom Transforms

```javascript
StyleDictionary.registerTransform({
  name: 'custom/color/uppercase',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    if (typeof token.value === 'string') {
      return token.value.toUpperCase();
    }
    return token.value;
  },
});
```

### Transform Groups

Predefined transform groups for common platforms:

```javascript
{
  "platforms": {
    "web": {
      "transformGroup": "web", // css + web transforms
    },
    "ios": {
      "transformGroup": "ios", // iOS-specific transforms
    },
    "android": {
      "transformGroup": "android", // Android-specific transforms
    },
    "scss": {
      "transformGroup": "scss", // SCSS-specific transforms
    }
  }
}
```

## Formats

### Built-in Formats

#### CSS Formats

- `css/variables`: CSS custom properties
- `css/variables-with-references`: CSS variables with references
- `css/classes`: CSS classes with token values

#### SCSS Formats

- `scss/variables`: SCSS variables
- `scss/map-deep`: SCSS nested map
- `scss/map-flat`: SCSS flat map
- `scss/icons`: SCSS icon utilities

#### JavaScript Formats

- `javascript/es6`: ES6 module exports
- `javascript/module`: CommonJS module
- `javascript/object`: JavaScript object

#### iOS Formats

- `ios-swift/class.swift`: Swift class
- `ios-swift/enum.swift`: Swift enum
- `ios-swift/struct.swift`: Swift struct
- `ios/colors.h`: Objective-C header

#### Android Formats

- `android/colors`: Android color resources
- `android/dimens`: Android dimension resources
- `android/fonts`: Android font resources

### Custom Formats

```javascript
StyleDictionary.registerFormat({
  name: 'custom/json',
  formatter: ({ dictionary, options }) => {
    return JSON.stringify.dictionary.allTokens, null, 2);
  }
});
```

### Format Configuration

```javascript
{
  "files": [
    {
      "destination": "variables.scss",
      "format": "scss/map-deep",
      "options": {
        "mapName": "design-tokens",
        "outputReferences": true,
        "showFileHeader": true
      }
    }
  ]
}
```

## Platforms

### Platform Configuration

Each platform defines how tokens should be transformed and formatted:

```javascript
{
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "prefix": "dt",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
```

### Platform Options

- `transformGroup`: Group of transforms to apply
- `transforms`: Array of specific transforms
- `buildPath`: Output directory
- `prefix`: Prefix for generated names
- `files`: Array of output files
- `options`: Platform-specific options

### Multi-Platform Setup

```javascript
{
  "platforms": {
    "web": {
      "transformGroup": "web",
      "buildPath": "build/web/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        },
        {
          "destination": "tokens.json",
          "format": "json/nested"
        }
      ]
    },
    "ios": {
      "transformGroup": "ios",
      "buildPath": "build/ios/",
      "files": [
        {
          "destination": "StyleDictionary.swift",
          "format": "ios-swift/class.swift",
          "className": "StyleDictionary"
        }
      ]
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "build/android/",
      "files": [
        {
          "destination": "colors.xml",
          "format": "android/colors"
        }
      ]
    }
  }
}
```

## Advanced Features

### References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns and Aliases

Tokens can reference other tokens:

```json
{
  "color": {
    "primary": {
      "value": "#007bff"
    },
    "background": {
      "value": "{color.primary}"
    },
    "border": {
      "value": "{color.background}"
    }
  }
}
```

### Transitive Transforms

Transforms that propagate through references:

```javascript
StyleDictionary.registerTransform({
  name: 'color/darken',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    // Darken color by 10%
    return darken(token.value, 0.1);
  },
});
```

### Filtering Tokens

Filter tokens for specific outputs:

```javascript
{
  "files": [
    {
      "destination": "colors.css",
      "format": "css/variables",
      "filter": {
        "attributes": { "category": "color" }
      }
    },
    {
      "destination": "sizes.css",
      "format": "css/variables",
      "filter": (token) => token.attributes.category === 'size'
    }
  ]
}
```

### Custom Filters

```javascript
StyleDictionary.registerFilter({
  name: 'isColor',
  matcher: (token) => token.type === 'color'
});

// Usage
{
  "filter": "isColor"
}
```

## DTCG Integration

### Enabling DTCG Support

```javascript
const StyleDictionary = require('style-dictionary').extend({
  usesDtcg: true,
  source: ['tokens/**/*.json'],
  // ... rest of config
});
```

### Converting to DTCG Format

Use the built-in conversion tool:

```bash
npx style-dictionary convert --from-style-dictionary --to-dtcg
```

### Mixed Format Support

Style Dictionary can handle both formats simultaneously:

```javascript
{
  "tokens": {
    // Standard format
    "color": {
      "primary": {
        "value": "#007bff",
        "type": "color"
      }
    },
    // DTCG format
    "spacing": {
      "small": {
        "$type": "dimension",
        "$value": {
          "value": 8,
          "unit": "px"
        }
      }
    }
  }
}
```

## Performance Optimization

### Incremental Builds

Only rebuild changed files:

```javascript
const StyleDictionary = require('style-dictionary');

const sd = StyleDictionary.extend('config.json');

// Build specific platforms
sd.buildPlatform('css');
sd.buildPlatform('ios');

// Build specific files
sd.buildFile('css/variables.css');
```

### Caching

Enable caching for faster builds:

```javascript
{
  "cache": true,
  "cachePath": ".style-dictionary-cache"
}
```

### Parallel Processing

Build multiple platforms in parallel:

```javascript
const platforms = ['css', 'scss', 'ios', 'android'];

await Promise.all(platforms.map((platform) => sd.buildPlatform(platform)));
```

## Extending Style Dictionary

### Custom Preprocessors

```javascript
StyleDictionary.registerPreprocessor('my-preprocessor', {
  preprocessor: (dictionary) => {
    // Modify dictionary before processing
    dictionary.allTokens.forEach((token) => {
      if (token.path.includes('deprecated')) {
        token.deprecated = true;
      }
    });
    return dictionary;
  },
});
```

### Custom Parsers

```javascript
StyleDictionary.registerParser('yaml', {
  pattern: /\.ya?ml$/,
  parser: (contents) => yaml.parse(contents),
});
```

### Custom Actions

```javascript
StyleDictionary.registerAction('custom-action', {
  do: (dictionary, config) => {
    // Custom action logic
    console.log('Building custom output...');
  },
  undo: (dictionary, config) => {
    // Cleanup logic
    console.log('Cleaning up...');
  },
});
```

## Best Practices (2026)

### Token Organization

1. **Use CTI structure** for consistent naming
2. **Group related tokens** logically
3. **Use semantic names** that reflect purpose
4. **Add descriptions** for all tokens
5. **Version your tokens** properly

### Platform Configuration

1. **Separate concerns** by platform
2. **Use transform groups** for consistency
3. **Configure output paths** logically
4. **Enable references** where appropriate
5. **Customize formats** for platform needs

### Performance

1. **Enable caching** for large projects
2. **Use incremental builds** during development
3. **Parallelize platform builds** in CI/CD
4. **Optimize token structure** for faster processing
5. **Monitor build times** regularly

### DTCG Migration

1. **Convert gradually** using built-in tools
2. **Test compatibility** with existing tools
3. **Update transforms** for new format
4. **Document migration** process
5. **Train team** on new format

## Integration Examples

### Next.js Integration

```javascript
// style-dictionary.config.js
const StyleDictionary = require('style-dictionary');

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    web: {
      transformGroup: 'web',
      buildPath: 'styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};

// next.config.js
module.exports = {
  webpack: (config) => {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('StyleDictionary', () => {
          const StyleDictionary = require('style-dictionary');
          const sd = StyleDictionary.extend('./style-dictionary.config.js');
          sd.buildAllPlatforms();
        });
      },
    });
    return config;
  },
};
```

### React Integration

```javascript
// tokens.js
export const tokens = require('./build/web/tokens.json');

// useTokens hook
export const useTokens = () => {
  return tokens;
};

// CSS-in-JS integration
export const cssVariables = (tokens) => {
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    acc[`--${key}`] = value;
    return acc;
  }, {});
};
```

### CI/CD Integration

```yaml
# .github/workflows/style-dictionary.yml
name: Build Design Tokens
on:
  push:
    paths: ['tokens/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:tokens
      - uses: actions/upload-artifact@v4
        with:
          name: design-tokens
          path: build/
```

## Troubleshooting

### Common Issues

**Circular References:**

```javascript
// Error: Circular reference detected
// Solution: Check token references for cycles
```

**Transform Conflicts:**

```javascript
// Error: Transform already registered
// Solution: Use unique transform names
```

**Platform Build Failures:**

```javascript
// Error: Platform not found
// Solution: Check platform configuration
```

### Debug Mode

Enable verbose logging:

```javascript
const StyleDictionary = require('style-dictionary');

const sd = StyleDictionary.extend({
  log: {
    verbosity: 'verbose',
  },
});
```

### Validation

Validate token structure:

```javascript
StyleDictionary.registerValidate({
  match: (token) => {
    return token.type === 'color' && !token.value;
  },
  validate: (token) => {
    throw new Error(`Color token ${token.name} has no value`);
  },
});
```

## Migration Guide

### From v3 to v4

**Breaking Changes:**

- DTCG format support
- Updated transform APIs
- New configuration options
- Changed default behaviors

**Migration Steps:**

1. **Update dependencies**: `npm install style-dictionary@latest`
2. **Enable DTCG**: Add `usesDtcg: true` to config
3. **Update transforms**: Check for deprecated transforms
4. **Test builds**: Verify all platforms work correctly
5. **Update documentation**: Document new format

### From Other Tools

**Tokens Studio:**

```javascript
// Export from Tokens Studio in DTCG format
// Use directly with Style Dictionary v4+
```

**Theo:**

```javascript
// Convert Theo JSON to Style Dictionary format
// Update transforms as needed
```

## References

### Official Resources

- [Style Dictionary Website](https://styledictionary.com/) - Official documentation and guides
- [GitHub Repository](https://github.com/amzn/style-dictionary) - Source code and issues
- [Playground](https://www.style-dictionary-play.dev/) - Interactive testing environment
- [API Reference](https://styledictionary.com/reference/api/) - Complete API documentation

### Configuration Reference

- [Configuration](https://styledictionary.com/reference/config/) - Complete configuration options
- [Transforms](https://styledictionary.com/reference/hooks/transforms/) - Built-in and custom transforms
- [Formats](https://styledictionary.com/reference/hooks/formats/) - Output format options
- [Filters](https://styledictionary.com/reference/hooks/filters/) - Token filtering options

### DTCG Integration

- [DTCG Support](https://styledictionary.com/info/dtcg/) - DTCG format compatibility
- [Token Formats](https://styledictionary.com/info/tokens/) - Token format comparison
- [Conversion Tool](https://styledictionary.com/info/dtcg/#convert-your-tokens-to-the-dtcg-format) - Format conversion

### Community Resources

- [Examples](https://github.com/style-dictionary/style-dictionary/tree/main/examples) - Example projects
- [Contributing Guide](https://github.com/style-dictionary/style-dictionary/blob/main/CONTRIBUTING.md) - How to contribute
- [Issues](https://github.com/style-dictionary/style-dictionary/issues) - Bug reports and feature requests

## Implementation

[Add content here]

## Testing

[Add content here]