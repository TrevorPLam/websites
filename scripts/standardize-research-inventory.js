#!/usr/bin/env node
/**
 * @file scripts/standardize-research-inventory.js
 * Purpose: Standardize RESEARCH-INVENTORY.md format for consistent parsing
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const RESEARCH_INVENTORY = path.join(ROOT_DIR, 'tasks', 'RESEARCH-INVENTORY.md');

function standardizeResearchInventory() {
  const content = fs.readFileSync(RESEARCH_INVENTORY, 'utf-8');
  
  // Extract topic descriptions from "Task IDs by Topic" section
  const taskMappingSection = content.match(/## Task IDs by Topic([\s\S]*?)---/)?.[1];
  const topicDescriptions = new Map();
  
  if (taskMappingSection) {
    const topicHeaders = taskMappingSection.matchAll(/^### (R-[A-Z0-9-]+) \(([^)]+)\)/gm);
    for (const match of topicHeaders) {
      topicDescriptions.set(match[1], match[2]);
    }
  }
  
  // Standardize Research Findings section headers to include descriptions
  let standardizedContent = content;
  const researchFindingsSection = content.match(/## Research Findings[^\n]*\n([\s\S]*?)(?=\n---|\n## |$)/);
  
  if (researchFindingsSection) {
    const findingsContent = researchFindingsSection[1];
    let updatedFindings = findingsContent;
    
    // Update each topic header to include description if available
    for (const [topicId, description] of topicDescriptions.entries()) {
      const headerRegex = new RegExp(`^### ${topicId}$`, 'gm');
      updatedFindings = updatedFindings.replace(headerRegex, `### ${topicId} (${description})`);
    }
    
    standardizedContent = content.replace(
      /## Research Findings[^\n]*\n([\s\S]*?)(?=\n---|\n## |$)/,
      `## Research Findings\n${updatedFindings}`
    );
  }
  
  // Write standardized content
  fs.writeFileSync(RESEARCH_INVENTORY, standardizedContent, 'utf-8');
  console.log('✓ Standardized RESEARCH-INVENTORY.md format');
}

standardizeResearchInventory();
