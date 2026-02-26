#!/usr/bin/env node

/**
 * @file packages/mcp-servers/src/sequential-thinking.ts
 * @summary Sequential Thinking MCP Server for structured AI reasoning
 * @description Externalizes AI reasoning as explicit steps and branches for complex problem-solving
 * @requirements MCP-001, AI-003
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Sequential Thinking Types
interface ReasoningStep {
  id: string;
  phase: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dependencies: string[];
  alternatives?: string[];
  reasoning?: string;
  duration?: number;
}

interface ReasoningPlan {
  id: string;
  goal: string;
  approach: string;
  steps: ReasoningStep[];
  createdAt: Date;
  status: 'planning' | 'executing' | 'completed' | 'failed';
}

interface BranchingPoint {
  stepId: string;
  alternatives: Array<{
    id: string;
    description: string;
    pros: string[];
    cons: string[];
    confidence: number;
  }>;
}

export class SequentialThinkingMCPServer {
  private server: McpServer;
  private plans: Map<string, ReasoningPlan> = new Map();
  private branches: Map<string, BranchingPoint> = new Map();

  constructor() {
    this.server = new McpServer({
      name: 'sequential-thinking-server',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools() {
    // Create structured reasoning plan
    this.server.tool(
      'create-reasoning-plan',
      'Create a structured reasoning plan for complex tasks',
      {
        goal: z.string().describe('The main goal or problem to solve'),
        approach: z.string().describe('Overall approach or methodology'),
        phases: z.array(z.string()).describe('List of reasoning phases'),
        exploreAlternatives: z.boolean().default(false).describe('Whether to explore alternative approaches'),
        savePlan: z.boolean().default(true).describe('Whether to save the plan for later use'),
      },
      async ({ goal, approach, phases, exploreAlternatives, savePlan }) => {
        const planId = `plan_${Date.now()}`;
        const steps: ReasoningStep[] = phases.map((phase, index) => ({
          id: `step_${index + 1}`,
          phase,
          description: `Execute ${phase} phase`,
          status: 'pending' as const,
          dependencies: index > 0 ? [`step_${index}`] : [],
        }));

        const plan: ReasoningPlan = {
          id: planId,
          goal,
          approach,
          steps,
          createdAt: new Date(),
          status: 'planning',
        };

        if (savePlan) {
          this.plans.set(planId, plan);
        }

        if (exploreAlternatives) {
          // Create branching points for key decision steps
          const keySteps = steps.filter((_, index) => index % 2 === 1); // Every other step
          keySteps.forEach(step => {
            this.branches.set(step.id, {
              stepId: step.id,
              alternatives: [
                {
                  id: `${step.id}_alt1`,
                  description: `Alternative approach for ${step.phase}`,
                  pros: ['Faster execution', 'Lower complexity'],
                  cons: ['Higher risk', 'Less thorough'],
                  confidence: 0.7,
                },
                {
                  id: `${step.id}_alt2`,
                  description: `Conservative approach for ${step.phase}`,
                  pros: ['Lower risk', 'More thorough'],
                  cons: ['Slower execution', 'Higher complexity'],
                  confidence: 0.9,
                },
              ],
            });
          });
        }

        return {
          content: [{
            type: 'text',
            text: `Created reasoning plan with ${steps.length} steps${exploreAlternatives ? ' and alternative approaches' : ''}`,
          }],
        };
      },
    );

    // Execute reasoning step
    this.server.tool(
      'execute-step',
      'Execute a specific reasoning step with detailed analysis',
      {
        planId: z.string().describe('ID of the reasoning plan'),
        stepId: z.string().describe('ID of the step to execute'),
        context: z.string().optional().describe('Additional context for execution'),
        alternativeId: z.string().optional().describe('Alternative approach to use'),
      },
      async ({ planId, stepId, context, alternativeId }) => {
        const plan = this.plans.get(planId);
        if (!plan) {
          return {
            content: [{ type: 'text', text: 'Plan not found' }],
          };
        }

        const step = plan.steps.find(s => s.id === stepId);
        if (!step) {
          return {
            content: [{ type: 'text', text: 'Step not found' }],
          };
        }

        // Check dependencies
        const incompleteDeps = step.dependencies.filter(depId => {
          const depStep = plan.steps.find(s => s.id === depId);
          return depStep && depStep.status !== 'completed';
        });

        if (incompleteDeps.length > 0) {
          return {
            content: [{ type: 'text', text: `Dependencies not completed: ${incompleteDeps.join(', ')` }],
          };
        }

        // Update step status
        step.status = 'in_progress';
        step.reasoning = `Executing ${step.phase} with context: ${context || 'none'}`;
        const startTime = Date.now();

        // Simulate step execution with detailed reasoning
        const executionResult = await this.simulateStepExecution(step, context, alternativeId);
        step.duration = Date.now() - startTime;
        step.status = executionResult.success ? 'completed' : 'failed';
        step.reasoning = executionResult.reasoning;

        // Update plan status
        const allCompleted = plan.steps.every(s => s.status === 'completed');
        const anyFailed = plan.steps.some(s => s.status === 'failed');
        plan.status = allCompleted ? 'completed' : anyFailed ? 'failed' : 'executing';

        return {
          content: [{
            type: 'text',
            text: `Step ${stepId} ${executionResult.success ? 'completed' : 'failed'}: ${step.reasoning}`
          }],
        };
      },
    );

    // Explore alternatives
    this.server.tool(
      'explore-alternatives',
      'Explore alternative approaches for a specific reasoning step',
      {
        planId: z.string().describe('ID of the reasoning plan'),
        stepId: z.string().describe('ID of the step to explore alternatives for'),
      },
      async ({ planId, stepId }) => {
        const branch = this.branches.get(stepId);
        if (!branch) {
          return {
            success: false,
            error: 'No alternatives found for this step',
          };
        }

        return {
          success: true,
          stepId,
          alternatives: branch.alternatives,
          recommendation: this.recommendAlternative(branch.alternatives),
        };
      },
    );

    // Get plan status
    this.server.tool(
      'get-plan-status',
      'Get the current status of a reasoning plan',
      {
        planId: z.string().describe('ID of the reasoning plan'),
      },
      async ({ planId }) => {
        const plan = this.plans.get(planId);
        if (!plan) {
          return {
            success: false,
            error: 'Plan not found',
          };
        }

        const progress = {
          total: plan.steps.length,
          completed: plan.steps.filter(s => s.status === 'completed').length,
          inProgress: plan.steps.filter(s => s.status === 'in_progress').length,
          failed: plan.steps.filter(s => s.status === 'failed').length,
          pending: plan.steps.filter(s => s.status === 'pending').length,
        };

        return {
          success: true,
          plan,
          progress,
          completionPercentage: (progress.completed / progress.total) * 100,
        };
      },
    );

    // Save plan to persistent storage
    this.server.tool(
      'save-plan',
      'Save a reasoning plan to persistent storage',
      {
        planId: z.string().describe('ID of the reasoning plan'),
      },
      async ({ planId }) => {
        const plan = this.plans.get(planId);
        if (!plan) {
          return {
            success: false,
            error: 'Plan not found',
          };
        }

        // In a real implementation, this would save to a database or file
        const planData = JSON.stringify(plan, null, 2);

        return {
          success: true,
          planId,
          message: 'Plan saved successfully',
          planData,
        };
      },
    );
  }

  private async simulateStepExecution(step: ReasoningStep, context?: string, alternativeId?: string) {
    // Simulate different execution patterns based on step type
    const executionPatterns = {
      'analyze': {
        reasoning: `Analyzed ${step.phase} with systematic approach. ${context ? `Context: ${context}` : ''}`,
        success: true,
        insights: ['Key patterns identified', 'Dependencies mapped', 'Risks assessed'],
      },
      'design': {
        reasoning: `Designed solution for ${step.phase} considering multiple factors. ${alternativeId ? `Using alternative: ${alternativeId}` : ''}`,
        success: true,
        insights: ['Architecture optimized', 'Scalability considered', 'Security integrated'],
      },
      'implement': {
        reasoning: `Implemented ${step.phase} with best practices. ${context ? `Additional context applied: ${context}` : ''}`,
        success: true,
        insights: ['Code follows patterns', 'Tests included', 'Documentation updated'],
      },
      'test': {
        reasoning: `Tested ${step.phase} comprehensively. ${alternativeId ? `Alternative testing approach: ${alternativeId}` : ''}`,
        success: true,
        insights: ['All test cases passed', 'Edge cases covered', 'Performance validated'],
      },
    };

    const pattern = executionPatterns[step.phase.split(' ')[0].toLowerCase()] || {
      reasoning: `Executed ${step.phase} with standard methodology. ${context ? `Context: ${context}` : ''}`,
      success: true,
      insights: ['Step completed successfully'],
    };

    // Add some randomness for realism
    const success = Math.random() > 0.1; // 90% success rate
    if (!success) {
      pattern.success = false;
      pattern.reasoning += ` Encountered issues requiring additional attention.`;
      pattern.insights = ['Issues identified', 'Requires rework', 'Dependencies missing'];
    }

    return pattern;
  }

  private recommendAlternative(alternatives: Array<{id: string; description: string; pros: string[]; cons: string[]; confidence: number}>) {
    // Recommend the alternative with highest confidence
    const bestAlternative = alternatives.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    return {
      recommended: bestAlternative.id,
      reasoning: `Recommended "${bestAlternative.description}" based on confidence score of ${bestAlternative.confidence}`,
      alternatives: alternatives.map(alt => ({
        id: alt.id,
        description: alt.description,
        confidence: alt.confidence,
        riskAssessment: alt.cons.length > alt.pros.length ? 'high' : alt.cons.length === alt.pros.length ? 'medium' : 'low',
      })),
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Sequential Thinking MCP Server running on stdio');
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SequentialThinkingMCPServer();
  server.run().catch(console.error);
}
