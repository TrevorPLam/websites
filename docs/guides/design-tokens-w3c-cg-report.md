# design-tokens-w3c-cg-report.md

W3C Design Tokens Community Group (DTCG) draft report on the design tokens specification as of February 2026, covering the stable v1.0 specification, implementation guidance, and ecosystem adoption.

## Overview

The Design Tokens Community Group (DTCG) is a W3C Community Group bringing together designers, developers, and tool makers to standardize how design tokens are defined and exchanged. The specification provides a vendor-agnostic foundation for sharing stylistic pieces of a design system at scale.

## Specification Status

- **Version**: 2025.10 (First Stable Version)
- **Status**: Draft Community Group Report
- **Publication Date**: 20 February 2026
- **Editors**: Louis Chenais, Mike Kamminga, Kathleen McMahon, Drew Powers, Matthew Ström-Awn, Donna Vitan, Daniel Banks, Esther Cheran, Ayesha Mazrana (Mazumdar), James Nash, Adekunle Oduye, Kevin Powell, Lilith Wittmann

⚠️ **Important**: This is a preview draft of in-progress changes. Do not reference this document directly, and do not implement anything in this document without consulting the stable specification.

## Key Features of v1.0

### Theming and Multi-Brand Support

- **Light/dark mode management** without file duplication
- **Accessibility variants** for contrast and user preferences
- **Brand theme switching** with inheritance and overrides
- **Component-level theming** for contextual styling

### Modern Color Specification

- **Display P3 color space** support for wider gamut displays
- **Oklch color space** for perceptual uniformity
- **CSS Color Module 4** compatibility
- **Design tool color matching** for accurate representation

### Rich Token Relationships

- **Inheritance** for token hierarchies
- **Aliases** for value reuse and references
- **Component-level references** for contextual tokens
- **Cross-file dependencies** for modular organization

### Cross-Platform Consistency

- **Single token file** generates platform-specific code
- **iOS, Android, web, and Flutter** support
- **Platform-specific optimizations** and conversions
- **Consistent behavior** across all platforms

## Specification Modules

The Design Tokens specification is composed of multiple modules:

### 1. Format Module

Defines the core JSON structure and syntax for design tokens.

**Key Properties:**

- `$value`: The token's value
- `$type`: The token's type (color, dimension, fontFamily, etc.)
- `$description`: Optional human-readable description

### 2. Color Module

Specifies color representation and manipulation.

**Features:**

- **Multiple color spaces**: sRGB, Display P3, Oklch
- **Color interpolation** for gradients and transitions
- **Accessibility calculations** for contrast ratios
- **Color transformations** for theming

### 3. Resolver Module

Defines how token references are resolved and computed.

**Capabilities:**

- **Reference resolution** with circular dependency detection
- **Type validation** and coercion
- **Computed values** for dynamic tokens
- **Error handling** and reporting

## Token Structure

### Basic Token

```json
{
  "token name": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [1, 0, 0]
    }
  }
}
```

### Token Properties

**Required Properties:**

- **Name**: Valid JSON string (case-sensitive)
- **`$value`**: The token's value (type-specific format)
- **`$type`**: One of the defined types

**Optional Properties:**

- **`$description`**: Human-readable description
- **`$extensions`**: Vendor-specific extensions

### Naming Conventions

**Character Restrictions:**

- Token names MUST NOT begin with `$` (reserved for spec properties)
- Token names MUST NOT contain `{`, `}`, or `.` (used in reference syntax)
- Case-sensitive naming (but tools may warn about case-only differences)

**Recommended Practices:**

- Use consistent naming patterns (kebab-case, camelCase, etc.)
- Avoid names that differ only by case
- Use semantic, descriptive names

## Token Types

### Color

Represents a color in the UI using the Color Module specification.

```json
{
  "primary": {
    "$type": "color",
    "$value": {
      "colorSpace": "srgb",
      "components": [0.2, 0.4, 0.8]
    },
    "$description": "Primary brand color"
  }
}
```

**Color Spaces:**

- **sRGB**: Standard web color space
- **Display P3**: Wider gamut for modern displays
- **Oklch**: Perceptually uniform for better gradients

### Dimension

Represents distance measurements (spacing, size, position).

```json
{
  "spacing-sm": {
    "$type": "dimension",
    "$value": {
      "value": 0.5,
      "unit": "rem"
    }
  },
  "border-width": {
    "$type": "dimension",
    "$value": {
      "value": 1,
      "unit": "px"
    }
  }
}
```

**Units:**

- **px**: Idealized viewport pixels (Android: dp, iOS: pt)
- **rem**: Multiple of default font size (Android: 16sp equivalent)

### Font Family

Represents font names or font stacks.

```json
{
  "font-primary": {
    "$type": "fontFamily",
    "$value": ["Inter", "Helvetica", "Arial", "sans-serif"]
  },
  "font-mono": {
    "$type": "fontFamily",
    "$value": "JetBrains Mono"
  }
}
```

### Font Weight

Represents font weight values.

```json
{
  "font-weight-normal": {
    "$type": "fontWeight",
    "$value": 400
  },
  "font-weight-bold": {
    "$type": "fontWeight",
    "$value": 700
  }
}
```

### Duration

Represents time durations for animations and transitions.

```json
{
  "duration-fast": {
    "$type": "duration",
    "$value": 150
  },
  "duration-slow": {
    "$type": "duration",
    "$value": 500
  }
}
```

### Cubic Bézier

Represents easing functions for animations.

```json
{
  "ease-fluid": {
    "$type": "cubicBezier",
    "$value": [0.3, 0, 0, 1]
  },
  "ease-snappy": {
    "$type": "cubicBezier",
    "$value": [0.2, 0, 0, 1]
  }
}
```

### Number

Represents numeric values without units.

```json
{
  "border-radius": {
    "$type": "number",
    "$value": 8
  },
  "opacity": {
    "$type": "number",
    "$value": 0.8
  }
}
```

## Composite Types

### Border

Represents complete border definitions.

```json
{
  "border-primary": {
    "$type": "border",
    "$value": {
      "color": "{color.primary}",
      "width": "{dimension.border-width}",
      "style": "solid"
    }
  }
}
```

### Shadow

Represents box shadow definitions.

```json
{
  "shadow-md": {
    "$type": "shadow",
    "$value": {
      "color": "{color.black}",
      "offsetX": {
        "value": 0,
        "unit": "px"
      },
      "offsetY": {
        "value": 4,
        "unit": "px"
      },
      "blur": {
        "value": 6,
        "unit": "px"
      },
      "spread": {
        "value": -1,
        "unit": "px"
      }
    }
  }
}
```

### Gradient

Represents gradient definitions.

```json
{
  "gradient-primary": {
    "$type": "gradient",
    "$value": {
      "type": "linear",
      "angle": 45,
      "stops": [
        {
          "color": "{color.primary}",
          "position": 0
        },
        {
          "color": "{color.secondary}",
          "position": 100
        }
      ]
    }
  }
}
```

### Typography

Represents complete typography definitions.

```json
{
  "typography-heading": {
    "$type": "typography",
    "$value": {
      "fontFamily": "{font.primary}",
      "fontSize": {
        "value": 2,
        "unit": "rem"
      },
      "fontWeight": "{font-weight.bold}",
      "lineHeight": 1.2,
      "letterSpacing": {
        "value": -0.02,
        "unit": "em"
      }
    }
  }
}
```

### Transition

Represents transition definitions.

```json
{
  "transition-default": {
    "$type": "transition",
    "$value": {
      "duration": "{duration.fast}",
      "delay": 0,
      "easing": "{ease-fluid}"
    }
  }
}
```

## Groups and Organization

### Group Structure

Tokens can be organized into hierarchical groups:

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.2, 0.4, 0.8]
      }
    },
    "secondary": {
      "$type": "color",
      "$value": "{color.primary}"
    }
  },
  "spacing": {
    "sm": {
      "$type": "dimension",
      "$value": {
        "value": 0.5,
        "unit": "rem"
      }
    }
  }
}
```

### Group Properties

Groups can have metadata and inherited properties:

```json
{
  "color": {
    "$type": "color",
    "$description": "Color palette",
    "primary": {
      "$value": {
        "colorSpace": "srgb",
        "components": [0.2, 0.4, 0.8]
      }
    }
  }
}
```

### Extending Groups

Groups can reference and extend other groups:

```json
{
  "base": {
    "color": {
      "$type": "color",
      "primary": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.2, 0.4, 0.8]
        }
      }
    }
  },
  "dark": {
    "$extends": ["base"],
    "color": {
      "primary": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.4, 0.6, 0.9]
        }
      }
    }
  }
}
```

## References and Aliases

### Reference Syntax

Tokens can reference other tokens using curly brace syntax:

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.2, 0.4, 0.8]
      }
    },
    "background": {
      "$type": "color",
      "$value": "{color.primary}"
    }
  }
}
```

### JSON Pointer Integration

References can use JSON Pointer syntax for complex paths:

```json
{
  "component": {
    "button": {
      "background": {
        "$type": "color",
        "$value": "{color.primary}"
      },
      "border": {
        "$type": "border",
        "$value": {
          "color": "{/component/button/background.$value}",
          "width": "{dimension.border-width}",
          "style": "solid"
        }
      }
    }
  }
}
```

### Property-Level References

References can target specific properties of composite tokens:

```json
{
  "shadow": {
    "large": {
      "$type": "shadow",
      "$value": {
        "color": "{color.black}",
        "offsetX": { "value": 0, "unit": "px" },
        "offsetY": { "value": 8, "unit": "px" },
        "blur": { "value": 16, "unit": "px" }
      }
    },
    "small": {
      "$type": "shadow",
      "$value": {
        "color": "{/shadow/large.$value.color}",
        "offsetX": { "value": 0, "unit": "px" },
        "offsetY": { "value": 2, "unit": "px" },
        "blur": { "value": 4, "unit": "px" }
      }
    }
  }
}
```

## Implementation Guidance

### Validation Rules

**Type Validation:**

- Every token MUST have a valid `$type` property
- Token values MUST match the expected type format
- Invalid tokens should produce clear error messages

**Reference Validation:**

- References MUST point to existing tokens
- Circular references MUST be detected and reported
- Cross-file references MUST be resolvable

**Character Validation:**

- Token names MUST NOT start with `$`
- Token names MUST NOT contain `{`, `}`, or `.`
- Names should be validated for platform compatibility

### Translation Guidelines

**Platform Conversions:**

- **px** → Android: dp, iOS: pt
- **rem** → Android: sp (assuming 16px base), others: fixed px
- **Color spaces** → Convert to platform-native formats
- **Font families** → Use platform-specific font stacks

**Error Handling:**

- Provide clear error messages for invalid tokens
- Graceful degradation for unsupported features
- Validation warnings for best practice violations

### Performance Considerations

**Resolution Optimization:**

- Cache resolved token values
- Lazy evaluation for complex references
- Incremental updates for token changes

**File Organization:**

- Split large token sets into logical modules
- Use efficient JSON parsing and serialization
- Implement proper dependency management

## Ecosystem Adoption

### Leading Adopters

**Design Tools:**

- **Figma**: Plugin support and native token integration
- **Sketch**: Token import/export functionality
- **Adobe XD**: Design token compatibility
- **Penpot**: Open-source token support
- **Framer**: Token-based design system integration

**Development Tools:**

- **Style Dictionary**: Reference implementation
- **Tokens Studio**: Figma plugin with DTCG support
- **Terrazzo**: Build-time token processing
- **Knapsack**: Design system documentation
- **Supernova**: Design token management

**Platform Support:**

- **Web**: CSS variables, Sass, LESS integration
- **iOS**: Swift and Objective-C code generation
- **Android**: Kotlin and Java resource generation
- **Flutter**: Dart code generation
- **React**: TypeScript and JavaScript integration

### Implementation Status

**Production Ready:**

- ✅ Style Dictionary (v4+)
- ✅ Tokens Studio (v2+)
- ✅ Terrazzo (v1+)
- ✅ Penpot (v1+)

**In Development:**

- 🔄 Figma (plugin ecosystem)
- 🔄 Sketch (token integration)
- 🔄 Adobe XD (compatibility layer)
- 🔄 Framer (design system tools)

**Community Support:**

- 📋 GitHub discussions and issue tracking
- 📚 Documentation and examples
- 🛠️ Development tools and validators
- 🏢 Enterprise consulting and support

## Migration Guide

### From Style Dictionary v3

**Old Format:**

```json
{
  "color": {
    "primary": {
      "value": "#1976d2",
      "type": "color"
    }
  }
}
```

**New DTCG Format:**

```json
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [0.098, 0.463, 0.824]
      }
    }
  }
}
```

### Migration Steps

1. **Update token structure** to use `$type` and `$value`
2. **Convert color formats** to color space components
3. **Update dimension values** to include units
4. **Migrate references** to new syntax
5. **Validate with official tools** and schemas

### Compatibility Considerations

**Breaking Changes:**

- Token property names (`$type`, `$value`)
- Color representation format
- Reference syntax changes
- Type system enhancements

**Backward Compatibility:**

- Migration tools and converters
- Gradual adoption strategies
- Hybrid format support during transition

## Best Practices (2026)

### Token Organization

1. **Hierarchical grouping** for logical organization
2. **Semantic naming** that reflects purpose, not appearance
3. **Consistent naming conventions** across the entire system
4. **Modular file structure** for maintainability
5. **Clear documentation** for complex tokens

### Type Usage

1. **Use appropriate types** for each token category
2. **Leverage composite types** for complex design elements
3. **Prefer references** over duplicate values
4. **Validate token types** during build processes
5. **Document type constraints** and expectations

### Cross-Platform Considerations

1. **Test on all target platforms** early and often
2. **Handle platform limitations** gracefully
3. **Use platform-agnostic units** when possible
4. **Provide fallback values** for unsupported features
5. **Document platform-specific behaviors**

### Performance Optimization

1. **Minimize reference depth** to avoid resolution complexity
2. **Use efficient file organization** for large token sets
3. **Implement proper caching** for resolved values
4. **Optimize for incremental updates** in design tools
5. **Monitor bundle sizes** for generated code

## Validation and Testing

### Schema Validation

Use the official JSON Schema for validation:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json"
}
```

### Testing Strategies

**Unit Tests:**

- Token type validation
- Reference resolution
- Value format compliance

**Integration Tests:**

- Cross-platform code generation
- Tool compatibility
- Performance benchmarks

**Visual Tests:**

- Design tool rendering
- Platform-specific output
- Accessibility compliance

## Future Roadmap

### Upcoming Features (2026)

**Enhanced Types:**

- **Custom type definitions** for domain-specific tokens
- **Generic type parameters** for reusable patterns
- **Union types** for flexible value options

**Advanced References:**

- **Computed values** with mathematical operations
- **Conditional references** based on context
- **Dynamic token generation** from data sources

**Tool Integration:**

- **Real-time synchronization** between design and code
- **Automated testing** of token implementations
- **Visual diff tools** for token changes

### Community Development

**Working Groups:**

- **Typography enhancement** working group
- **Animation and motion** specification
- **Accessibility and theming** standards
- **Performance optimization** guidelines

**Open Development:**

- **GitHub-based collaboration** for specification evolution
- **Community calls** and working sessions
- **Implementation feedback** and real-world testing
- **Educational resources** and best practices

## References

### Official Resources

- [Design Tokens Community Group](https://www.designtokens.org/) - Official website and documentation
- [Specification Draft](https://www.designtokens.org/TR/drafts/) - Current working draft
- [Technical Reports](https://www.designtokens.org/technical-reports/) - Published specifications
- [GitHub Repository](https://github.com/design-tokens/community-group) - Source code and discussions

### Specification Modules

- [Format Module](https://www.designtokens.org/tr/drafts/format/) - Core JSON structure and types
- [Color Module](https://www.designtokens.org/tr/drafts/color/) - Color representation and spaces
- [Resolver Module](https://www.designtokens.org/tr/drafts/resolver/) - Reference resolution and computation

### Community Resources

- [W3C Community Group Page](https://www.w3.org/community/design-tokens/) - Official W3C group page
- [Participant List](https://www.w3.org/community/design-tokens/participants) - Group participants and contributors
- [FAQ](https://www.designtokens.org/faq/) - Frequently asked questions
- [Glossary](https://www.designtokens.org/glossary/) - Terminology and definitions
- [Resources](https://www.designtokens.org/resources/) - Additional documentation and tools

### Implementation Tools

- [Style Dictionary](https://styledictionary.com/) - Reference implementation
- [Tokens Studio](https://tokens.studio/) - Figma plugin and tooling
- [Terrazzo](https://terrazzo.app/) - Build-time token processing
- [Design Token Validator](https://animaapp.github.io/design-token-validator-site/) - Validation tooling
