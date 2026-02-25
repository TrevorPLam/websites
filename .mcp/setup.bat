@echo off
REM MCP Setup Script for Marketing Websites Monorepo (Windows)
REM Based on agentic development best practices

echo 🚀 Setting up MCP servers for Marketing Websites Monorepo...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed. Please install Node.js first.
    exit /b 1
)

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm is required but not installed. Please install pnpm first.
    exit /b 1
)

echo ✅ Node.js and pnpm found

REM Install MCP servers globally
echo 📦 Installing MCP servers...

echo Installing @modelcontextprotocol/server-dependency-graph...
pnpm add -g @modelcontextprotocol/server-dependency-graph
echo Installing @modelcontextprotocol/server-filesystem...
pnpm add -g @modelcontextprotocol/server-filesystem
echo Installing @modelcontextprotocol/server-git...
pnpm add -g @modelcontextprotocol/server-git
echo Installing @modelcontextprotocol/server-github...
pnpm add -g @modelcontextprotocol/server-github
echo Installing @modelcontextprotocol/server-brave-search...
pnpm add -g @modelcontextprotocol/server-brave-search
echo Installing @modelcontextprotocol/server-sequential-thinking...
pnpm add -g @modelcontextprotocol/server-sequential-thinking
echo Installing @modelcontextprotocol/server-memory...
pnpm add -g @modelcontextprotocol/server-memory

REM Create .mcp directory if it doesn't exist
if not exist .mcp mkdir .mcp

REM Verify configuration
echo 🔍 Verifying MCP configuration...

if exist .mcp\config.json (
    echo ✅ MCP configuration found
) else (
    echo ❌ MCP configuration not found
    exit /b 1
)

REM Create memory file if it doesn't exist
if not exist .mcp\memory.json (
    echo 🧠 Creating memory file...
    echo {"memory": {"project_context": "Marketing Websites Monorepo initialization"}} > .mcp\memory.json
    echo ✅ Memory file created
)

REM Check environment variables
echo 🔐 Checking environment variables...

if "%GITHUB_TOKEN%"=="" (
    echo ⚠️  GITHUB_TOKEN not set. GitHub MCP server will have limited functionality.
    echo    Set GITHUB_TOKEN in your environment variables.
)

if "%BRAVE_API_KEY%"=="" (
    echo ⚠️  BRAVE_API_KEY not set. Brave Search MCP server will not work.
    echo    Get API key at: https://brave.com/search/api/
)

REM Test MCP servers
echo 🧪 Testing MCP servers...

echo Testing dependency-graph server...
npx @modelcontextprotocol/server-dependency-graph --help >nul 2>nul && echo ✅ dependency-graph server works || echo ❌ dependency-graph server failed

echo Testing filesystem server...
npx @modelcontextprotocol/server-filesystem --help >nul 2>nul && echo ✅ filesystem server works || echo ❌ filesystem server failed

echo Testing git server...
npx @modelcontextprotocol/server-git --help >nul 2>nul && echo ✅ git server works || echo ❌ git server failed

echo Testing sequential-thinking server...
npx @modelcontextprotocol/server-sequential-thinking --help >nul 2>nul && echo ✅ sequential-thinking server works || echo ❌ sequential-thinking server failed

echo.
echo 🎉 MCP setup complete!
echo.
echo Next steps:
echo 1. Set up environment variables (see .mcp\README.md)
echo 2. Restart your AI assistant to load MCP servers
echo 3. Test functionality with your AI assistant
echo.
echo For troubleshooting, see: .mcp\README.md
pause
