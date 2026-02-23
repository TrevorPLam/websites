<!--
/**
 * @file llms-txt-spec.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for llms txt spec.
 * @entrypoints docs/guides/llms-txt-spec.md
 * @exports llms txt spec
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# llms.txt-spec.md

## Table of Contents

- [Overview](#overview)
- [Implementation](#implementation)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [References](#references)


# llms.txt Specification

> The llms.txt specification provides a standardized way for websites to offer LLM-friendly content through a simple markdown file placed at `/llms.txt`. This enables large language models to efficiently access curated, clean information without parsing complex HTML layouts.

## Background

Large language models increasingly rely on website information for real-time context during conversations, but face critical limitations:

- **Context window constraints**: Most websites are too large to fit entirely within LLM context windows
- **HTML complexity**: Navigation menus, cookie banners, sidebars, and JavaScript-heavy layouts create noise
- **Real-time requirements**: Unlike search engines that crawl over days/weeks, LLMs need immediate access during conversations
- **Parsing challenges**: Converting complex HTML to clean, LLM-readable text is difficult and imprecise

The specification, proposed by Jeremy Howard of Answer.AI in September 2024, addresses these challenges by providing a curated, markdown-based content structure specifically designed for AI consumption.

## Proposal

The llms.txt specification consists of two core components:

### 1. Primary llms.txt File

A markdown file placed at the root path `/llms.txt` (or optionally in subpaths) that contains:

- Brief background information about the site/project
- Curated links to the most important LLM-friendly content
- Structured organization using standard markdown formatting
- Both internal and external links as appropriate

### 2. Markdown Page Variants

Websites should provide clean markdown versions of important pages at the same URL with `.md` appended:

- `page.html` → `page.html.md`
- `directory/` → `directory/index.html.md`

This eliminates HTML parsing overhead and provides pure text content optimized for LLM consumption.

## Format Specification

The llms.txt file uses markdown structure with specific requirements:

### Required Sections (in order)

1. **H1 Header**: Project or site name (only required section)
2. **Blockquote**: Short summary with key information for understanding the file
3. **Optional Details**: Zero or more markdown sections (paragraphs, lists) except headings
4. **File Lists**: Zero or more sections delimited by H2 headers containing URL lists

### File List Format

Each file list is a markdown list with items following this pattern:

```markdown
- [Link Title](URL): Optional link description
```

- The `[Link Title](URL)` part is required
- The `:` and description are optional
- Descriptions should be brief and informative

### Special "Optional" Section

An H2 section titled "Optional" has special meaning:

- URLs in this section can be skipped for shorter context
- Use for secondary information that's often unnecessary
- Helps manage context window limitations

### Example Structure

```markdown
# Project Name > Brief project description

Additional context and important notes about interpreting the content.

## Documentation

- [Quick Start Guide](https://example.com/docs/quickstart.md): Get started in 5 minutes
- [API Reference](https://example.com/docs/api.md): Complete API documentation

## Examples

- [Basic Tutorial](https://example.com/examples/basic.md): Step-by-step beginner guide
- [Advanced Patterns](https://example.com/examples/advanced.md): Complex use cases

## Optional

- [Historical Notes](https://example.com/docs/history.md): Background and evolution
```

## Implementation Guidelines

### Content Curation Principles

- **Conciseness**: Use clear, brief language suitable for expert-level understanding
- **Relevance**: Include only the most important content for understanding the project
- **Context**: Provide brief, informative descriptions for all links
- **Clarity**: Avoid ambiguous terms or unexplained jargon

### Technical Considerations

- **File Location**: Place at `/llms.txt` in the website root
- **Character Encoding**: Use UTF-8 encoding
- **Line Endings**: Use standard LF (\n) line endings
- **Size Limits**: Keep files reasonably sized for efficient parsing

### Testing and Validation

- Test with multiple LLMs to ensure they can answer questions about your content
- Use tools like `llms_txt2ctx` to expand and validate the structure
- Verify that all linked `.md` versions are accessible and properly formatted

## Existing Standards Integration

llms.txt is designed to complement, not replace, existing web standards:

### robots.txt

- **Purpose**: Controls bot access permissions
- **llms.txt**: Provides content structure for allowed access
- **Relationship**: Different purposes, can coexist

### sitemap.xml

- **Purpose**: Lists all indexable pages for search engines
- **llms.txt**: Provides curated overview for LLMs
- **Differences**:
  - sitemaps include all pages, llms.txt is curated
  - sitemaps don't include external links, llms.txt can
  - sitemaps may be too large for LLM context windows

### Structured Data

- **Purpose**: Machine-readable metadata
- **llms.txt**: Can reference and provide context for structured data
- **Relationship**: Complementary approaches

## Tools and Integrations

### Official Tools

- **llms_txt2ctx**: CLI and Python module for parsing llms.txt files and generating LLM context
- **JavaScript Implementation**: Sample JS implementation for parsing and processing

### Platform Integrations

- **VitePress Plugin**: `vitepress-plugin-llms` automatically generates LLM-friendly documentation
- **Docusaurus Plugin**: `docusaurus-plugin-llms` for Docusaurus sites
- **Drupal Support**: Full support for Drupal 10.3+ sites
- **PHP Library**: `llms-txt-php` for reading/writing llms.txt files

### Development Tools

- **VS Code Extension**: PagePilot automatically loads external context for enhanced responses
- **Mintlify**: Automatic llms.txt generation for documentation sites (enabled November 2024)

## Adoption and Usage

### Current Adoption (2026)

As of early 2026, llms.txt has gained moderate attention with:

- **844,000+ sites** implementing the standard
- **Major platforms**: Mintlify, Supabase, Zapier, Modal, Anthropic, Cursor, Pinecone
- **Documentation focus**: Strong adoption in technical documentation and developer tools

### Notable Implementations

- **Stripe**: Comprehensive llms.txt with payments documentation
- **Anthropic Claude**: Multi-language documentation structure
- **FastHTML**: Canonical example with full implementation
- **Vercel**: Large-scale implementation (400,000+ words in llms-full.txt)

### Use Cases

- **Software Documentation**: API references, tutorials, examples
- **Corporate Websites**: Company structure, key information sources
- **Educational Content**: Course summaries, resource collections
- **Personal Portfolios**: CV information, project descriptions
- **E-commerce**: Product categories, policies, support information

## Best Practices

### Content Organization

1. **Start with most important content**: Put critical information first
2. **Use logical sections**: Group related content under descriptive H2 headers
3. **Provide context**: Include brief descriptions for all links
4. **Consider context limits**: Use the "Optional" section for secondary content

### Technical Implementation

1. **Ensure accessibility**: Place llms.txt at the correct path
2. **Validate links**: Check that all URLs are accessible and correct
3. **Test thoroughly**: Validate with multiple LLMs and tools
4. **Maintain consistency**: Keep llms.txt synchronized with site content

### Maintenance

1. **Regular updates**: Keep llms.txt current with site changes
2. **Link validation**: Periodically check all linked URLs
3. **Content review**: Ensure descriptions remain accurate and helpful
4. **Performance monitoring**: Track how LLMs use your llms.txt content

## Limitations and Considerations

### Current Limitations

- **Not universally adopted**: Major LLMs like Gemini and ChatGPT don't yet use it systematically
- **Specification maturity**: Still an emerging standard with evolving best practices
- **Tool ecosystem**: Growing but still limited tool support
- **Measuring effectiveness**: Difficult to track direct impact on AI responses

### Strategic Considerations

- **Future-proofing**: Early adoption may provide advantages as the standard matures
- **Low maintenance overhead**: Simple to implement and maintain
- **Complementary approach**: Works alongside existing SEO and content strategies
- **Developer experience**: Particularly valuable for technical documentation and APIs

## Next Steps and Community

### Specification Development

- **GitHub Repository**: Hosted at `AnswerDotAI/llms-txt` for community input
- **Discord Channel**: Available for implementation discussions and best practices
- **Issue Tracking**: Open for bug reports and enhancement requests

### Community Resources

- **Directories**: `llmstxt.site` and `directory.llmstxt.cloud` list existing implementations
- **Examples**: Growing collection of real-world implementations
- **Tools**: Expanding ecosystem of parsers and generators

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Official llms.txt specification](https://llmstxt.org/)
- [Answer.AI original proposal](https://www.answer.ai/posts/2024-09-03-llmstxt.html)
- [FastHTML implementation example](https://www.fastht.ml/docs/llms.txt)
- [llms_txt2ctx tool](https://llmstxt.org/intro.html)
- [Community directory](https://llmstxt.site/)
- [Mintlify adoption announcement](https://www.mintlify.com/blog/simplifying-docs-with-llms-txt)
- [VitePress plugin](https://github.com/okineadev/vitepress-plugin-llms)
- [Docusaurus plugin](https://github.com/rachfop/docusaurus-plugin-llms)


## Overview

[Add content here]
