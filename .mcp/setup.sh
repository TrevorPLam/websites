#!/bin/bash

# MCP Setup Script for Marketing Websites Monorepo
# Based on agentic development best practices

echo "🚀 Setting up MCP servers for Marketing Websites Monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is required but not installed. Please install pnpm first."
    exit 1
fi

echo "✅ Node.js and pnpm found"

# Install MCP servers globally
echo "📦 Installing MCP servers..."

servers=(
    "@modelcontextprotocol/server-dependency-graph"
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-git"
    "@modelcontextprotocol/server-github"
    "@modelcontextprotocol/server-brave-search"
    "@modelcontextprotocol/server-sequential-thinking"
    "@modelcontextprotocol/server-memory"
)

for server in "${servers[@]}"; do
    echo "Installing $server..."
    pnpm add -g "$server" || echo "⚠️  Failed to install $server (may need manual installation)"
done

# Create .mcp directory if it doesn't exist
mkdir -p .mcp

# Verify configuration
echo "🔍 Verifying MCP configuration..."

if [ -f ".mcp/config.json" ]; then
    echo "✅ MCP configuration found"
    
    # Validate JSON syntax
    if node -e "JSON.parse(require('fs').readFileSync('.mcp/config.json', 'utf8'))" 2>/dev/null; then
        echo "✅ Configuration JSON is valid"
    else
        echo "❌ Configuration JSON is invalid"
        exit 1
    fi
else
    echo "❌ MCP configuration not found"
    exit 1
fi

# Create memory file if it doesn't exist
if [ ! -f ".mcp/memory.json" ]; then
    echo "🧠 Creating memory file..."
    echo '{"memory": {"project_context": "Marketing Websites Monorepo initialization"}}' > .mcp/memory.json
    echo "✅ Memory file created"
fi

# Check environment variables
echo "🔐 Checking environment variables..."

if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN not set. GitHub MCP server will have limited functionality."
    echo "   Set GITHUB_TOKEN in your environment or .env file."
fi

if [ -z "$BRAVE_API_KEY" ]; then
    echo "⚠️  BRAVE_API_KEY not set. Brave Search MCP server will not work."
    echo "   Get API key at: https://brave.com/search/api/"
fi

# Test MCP servers
echo "🧪 Testing MCP servers..."

echo "Testing dependency-graph server..."
npx @modelcontextprotocol/server-dependency-graph --help > /dev/null 2>&1 && echo "✅ dependency-graph server works" || echo "❌ dependency-graph server failed"

echo "Testing filesystem server..."
npx @modelcontextprotocol/server-filesystem --help > /dev/null 2>&1 && echo "✅ filesystem server works" || echo "❌ filesystem server failed"

echo "Testing git server..."
npx @modelcontextprotocol/server-git --help > /dev/null 2>&1 && echo "✅ git server works" || echo "❌ git server failed"

echo "Testing sequential-thinking server..."
npx @modelcontextprotocol/server-sequential-thinking --help > /dev/null 2>&1 && echo "✅ sequential-thinking server works" || echo "❌ sequential-thinking server failed"

echo ""
echo "🎉 MCP setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables (see .mcp/README.md)"
echo "2. Restart your AI assistant to load MCP servers"
echo "3. Test functionality with your AI assistant"
echo ""
echo "For troubleshooting, see: .mcp/README.md"
