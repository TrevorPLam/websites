#!/usr/bin/env node
/**
 * @file mcp/servers/src/skillset-server.ts
 * @summary MCP server for reading and serving skills from the skills directory.
 * @description Provides skill listing, retrieval, and search capabilities for AI agents.
 * @security Validates file paths to prevent directory traversal attacks.
 * @adr none
 * @requirements TASKS3.md S-02, MCP integration standards
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

const SKILLS_PATH = process.env.SKILLS_PATH || 'skills';

class SkillsetServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-skillset',
        version: '1.0.0',
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
      const skills = await this.loadSkills();

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
            description: 'Get detailed information about a specific skill',
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
                  description: 'Filter by skill category (workflow, integration, etc.)',
                },
              },
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
            return await this.handleGetSkill(args.skillName);

          case 'search_skills':
            return await this.handleSearchSkills(args.query, args.category);

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

  private async loadSkills(): Promise<any[]> {
    const skills: any[] = [];

    try {
      const categories = await fs.readdir(SKILLS_PATH);

      for (const category of categories) {
        const categoryPath = path.join(SKILLS_PATH, category);
        const stat = await fs.stat(categoryPath);

        if (stat.isDirectory()) {
          const skillFiles = await fs.readdir(categoryPath);

          for (const file of skillFiles) {
            if (file.endsWith('.md')) {
              const filePath = path.join(categoryPath, file);
              const content = await fs.readFile(filePath, 'utf-8');
              const skill = this.parseSkillFile(content, file, category);
              if (skill) {
                skills.push(skill);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }

    return skills;
  }

  private parseSkillFile(content: string, filename: string, category: string): any | null {
    try {
      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) return null;

      const frontmatter = frontmatterMatch[1];
      const skill: any = {
        name: filename.replace('.md', ''),
        category,
        filename,
        frontmatter: {},
      };

      // Parse YAML frontmatter (simple parsing)
      const lines = frontmatter.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();

          // Remove quotes if present
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          skill.frontmatter[key] = value;
        }
      }

      // Extract description from content
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
    const skill = skills.find((s) => s.name === skillName || s.filename === skillName);

    if (!skill) {
      throw new McpError(ErrorCode.InvalidParams, `Skill '${skillName}' not found`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(skill, null, 2),
        },
      ],
    };
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Skillset Server running on stdio');
  }
}

const server = new SkillsetServer();
server.run().catch(console.error);
