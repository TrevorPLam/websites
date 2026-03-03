#!/usr/bin/env node
/**
 * @file mcp/servers/src/skillset-server.ts
 * @summary MCP server for reading and serving skills from the skills directory.
 * @description Provides skill listing, retrieval, search, and auto-discovery capabilities for AI agents.
 *   Supports three-tier progressive disclosure: Tier 1 (SKILL.md frontmatter), Tier 2 (instructions/full.md),
 *   Tier 3 (scripts/ and references/). Skills are organized as skills/[category]/[skillname]/SKILL.md.
 * @security Validates file paths to prevent directory traversal attacks.
 * @adr none
 * @requirements TASKS3.md S-02, MCP integration standards, TODO.md 4-A, 5-A
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const SKILLS_PATH = process.env.SKILLS_PATH || path.resolve(process.cwd(), 'skills');

interface SkillEntry {
  name: string;
  category: string;
  skillDirName: string;
  skillDirPath: string;
  filename: string;
  frontmatter: Record<string, string>;
  description?: string;
}

interface RankedSkill extends SkillEntry {
  score: number;
}

class SkillsetServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-skillset',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_skills',
            description: 'List all available skills in the skills directory',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_skill',
            description: 'Get Tier 1 metadata about a specific skill (name, description, invokes)',
            inputSchema: {
              type: 'object',
              properties: {
                skillName: {
                  type: 'string',
                  description: 'Name of the skill to retrieve',
                },
              },
              required: ['skillName'],
            },
          },
          {
            name: 'get_skill_instructions',
            description:
              'Get Tier 2 detailed instructions for a skill (full workflow steps, loaded on demand)',
            inputSchema: {
              type: 'object',
              properties: {
                skillName: {
                  type: 'string',
                  description: 'Name of the skill whose instructions to retrieve',
                },
              },
              required: ['skillName'],
            },
          },
          {
            name: 'search_skills',
            description: 'Search for skills by category, name, or description',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to find matching skills',
                },
                category: {
                  type: 'string',
                  description: 'Filter by skill category (core, domain, integration, etc.)',
                },
              },
            },
          },
          {
            name: 'discover_skills',
            description:
              'Discover and rank skills by relevance to a query. Returns the most applicable skills for a given task or intent.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'What you are trying to accomplish (e.g. "deploy to production")',
                },
                context: {
                  type: 'string',
                  description: 'Additional context about the current task or environment',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of skills to return (default: 5)',
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_skills':
            return await this.handleListSkills();

          case 'get_skill':
            return await this.handleGetSkill(args?.skillName as string);

          case 'get_skill_instructions':
            return await this.handleGetSkillInstructions(args?.skillName as string);

          case 'search_skills':
            return await this.handleSearchSkills(
              args?.query as string | undefined,
              args?.category as string | undefined
            );

          case 'discover_skills':
            return await this.handleDiscoverSkills(
              args?.query as string,
              args?.context as string | undefined,
              args?.limit as number | undefined
            );

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  /**
   * Traverses the two-level skill directory structure:
   *   skills/[category]/[skillname]/SKILL.md
   * Falls back to flat structure:
   *   skills/[category]/skill.md
   */
  private async loadSkills(): Promise<SkillEntry[]> {
    const skills: SkillEntry[] = [];

    try {
      const categories = await fs.readdir(SKILLS_PATH);

      for (const category of categories) {
        const categoryPath = path.join(SKILLS_PATH, category);
        let catStat;
        try {
          catStat = await fs.stat(categoryPath);
        } catch {
          continue;
        }
        if (!catStat.isDirectory()) continue;

        const items = await fs.readdir(categoryPath);

        for (const item of items) {
          const itemPath = path.join(categoryPath, item);
          let itemStat;
          try {
            itemStat = await fs.stat(itemPath);
          } catch {
            continue;
          }

          if (itemStat.isDirectory()) {
            // Two-level structure: skills/[category]/[skillname]/SKILL.md
            const skillMdPath = path.join(itemPath, 'SKILL.md');
            try {
              const content = await fs.readFile(skillMdPath, 'utf-8');
              const skill = this.parseSkillFile(content, 'SKILL.md', category);
              if (skill) {
                skill.skillDirName = item;
                skill.skillDirPath = itemPath;
                skills.push(skill);
              }
            } catch {
              // No SKILL.md in this directory, skip
            }
          } else if (item.endsWith('.md') && item !== 'README.md') {
            // Flat structure: skills/[category]/skill.md (backward compatibility)
            try {
              const content = await fs.readFile(itemPath, 'utf-8');
              const skill = this.parseSkillFile(content, item, category);
              if (skill) {
                skill.skillDirName = item.replace('.md', '');
                skill.skillDirPath = categoryPath;
                skills.push(skill);
              }
            } catch {
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }

    return skills;
  }

  private parseSkillFile(content: string, filename: string, category: string): SkillEntry | null {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return null;

      const frontmatter = frontmatterMatch[1];
      const skill: SkillEntry = {
        name: filename.replace('.md', ''),
        category,
        skillDirName: '',
        skillDirPath: '',
        filename,
        frontmatter: {},
      };

      // Parse YAML frontmatter (simple single-line key:value parsing)
      const lines = frontmatter.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();

          // Remove quotes if present
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          // Use name from frontmatter when present
          if (key === 'name' && value) {
            skill.name = value;
          }

          skill.frontmatter[key] = value;
        }
      }

      // Extract description from ## Overview section (for backward compat)
      const descriptionMatch = content.match(/## Overview\n\n([\s\S]*?)(?=\n##|\n\n|$)/);
      if (descriptionMatch) {
        skill.description = descriptionMatch[1].trim();
      }

      return skill;
    } catch (error) {
      console.error(`Error parsing skill file ${filename}:`, error);
      return null;
    }
  }

  private async handleListSkills() {
    const skills = await this.loadSkills();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              skills: skills.map((skill) => ({
                name: skill.name,
                category: skill.category,
                description: skill.frontmatter.description || skill.description,
                version: skill.frontmatter.version || '1.0.0',
                author: skill.frontmatter.author || 'Unknown',
                tier2: skill.frontmatter.tier2 || null,
              })),
              total: skills.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleGetSkill(skillName: string) {
    const skills = await this.loadSkills();
    const skill = skills.find(
      (s) => s.name === skillName || s.skillDirName === skillName || s.filename === skillName
    );

    if (!skill) {
      throw new McpError(ErrorCode.InvalidParams, `Skill '${skillName}' not found`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              name: skill.name,
              category: skill.category,
              description: skill.frontmatter.description || skill.description,
              version: skill.frontmatter.version || '1.0.0',
              author: skill.frontmatter.author || 'Unknown',
              tier2: skill.frontmatter.tier2 || null,
              frontmatter: skill.frontmatter,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Loads Tier 2 detailed instructions for a skill.
   * Reads the file referenced by `tier2` in the SKILL.md frontmatter (e.g. instructions/full.md).
   */
  private async handleGetSkillInstructions(skillName: string) {
    const skills = await this.loadSkills();
    const skill = skills.find(
      (s) => s.name === skillName || s.skillDirName === skillName || s.filename === skillName
    );

    if (!skill) {
      throw new McpError(ErrorCode.InvalidParams, `Skill '${skillName}' not found`);
    }

    const tier2Relative = skill.frontmatter.tier2;
    if (!tier2Relative) {
      return {
        content: [
          {
            type: 'text',
            text: `No Tier 2 instructions available for skill '${skillName}'. The SKILL.md does not specify a tier2 path.`,
          },
        ],
      };
    }

    // Resolve tier2 path relative to skill directory
    const tier2FullPath = path.resolve(skill.skillDirPath, tier2Relative);

    // Security: prevent directory traversal outside skills directory
    const resolvedSkillsPath = path.resolve(SKILLS_PATH);
    const relativePath = path.relative(resolvedSkillsPath, tier2FullPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Invalid tier2 path: must be within the skills directory'
      );
    }

    try {
      const content = await fs.readFile(tier2FullPath, 'utf-8');
      return {
        content: [{ type: 'text', text: content }],
      };
    } catch {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to load Tier 2 instructions for '${skillName}': file not found at '${tier2Relative}'`
      );
    }
  }

  private async handleSearchSkills(query?: string, category?: string) {
    const skills = await this.loadSkills();
    let filteredSkills = skills;

    if (category) {
      filteredSkills = filteredSkills.filter((skill) =>
        skill.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (query) {
      const queryLower = query.toLowerCase();
      filteredSkills = filteredSkills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(queryLower) ||
          skill.description?.toLowerCase().includes(queryLower) ||
          skill.frontmatter.description?.toLowerCase().includes(queryLower)
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              skills: filteredSkills.map((skill) => ({
                name: skill.name,
                category: skill.category,
                description: skill.frontmatter.description || skill.description,
                version: skill.frontmatter.version || '1.0.0',
                author: skill.frontmatter.author || 'Unknown',
                tier2: skill.frontmatter.tier2 || null,
              })),
              total: filteredSkills.length,
              query,
              category,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Ranks all skills by relevance to the provided query and context.
   * Scoring considers: name matches, USE FOR phrases, description keywords.
   */
  private async handleDiscoverSkills(query: string, context?: string, limit?: number) {
    const skills = await this.loadSkills();
    const maxResults = limit ?? 5;

    const ranked: RankedSkill[] = skills
      .map((skill) => ({ ...skill, score: this.scoreRelevance(skill, query, context) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              skills: ranked.map((s) => ({
                name: s.name,
                category: s.category,
                description: s.frontmatter.description || s.description,
                score: s.score,
                tier2: s.frontmatter.tier2 || null,
              })),
              query,
              context,
              total: ranked.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Scores a skill's relevance to the provided query and optional context.
   * Uses keyword matching against name, USE FOR phrases, and description tokens.
   */
  private scoreRelevance(skill: SkillEntry, query: string, context?: string): number {
    const queryLower = query.toLowerCase();
    const contextLower = (context ?? '').toLowerCase();
    const description = (skill.frontmatter.description ?? skill.description ?? '').toLowerCase();
    const nameLower = skill.name.toLowerCase();

    let score = 0;

    // Exact name match
    if (nameLower === queryLower) score += 100;
    else if (nameLower.includes(queryLower) || queryLower.includes(nameLower)) score += 50;

    // USE FOR phrase matches (e.g. USE FOR: "deploy to prod", "production release")
    const useForMatches = description.match(/use for:\s*"([^"]+)"/gi) ?? [];
    for (const match of useForMatches) {
      const phrase = match.replace(/use for:\s*"/i, '').replace('"', '').toLowerCase();
      if (queryLower.includes(phrase) || phrase.split(/[\s,]+/).some((w) => queryLower.includes(w)))
        score += 40;
    }

    // Individual keyword matches in description
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
    for (const word of queryWords) {
      if (description.includes(word)) score += 10;
      if (contextLower && contextLower.includes(word) && description.includes(word)) score += 5;
    }

    return score;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Skillset Server running on stdio');
  }
}

const server = new SkillsetServer();
server.run().catch(console.error);
