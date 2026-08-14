# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Project Overview

`cyber-slack` is a Slack CLI and MCP server for AI agents. It provides:

- **CLI**: Command-line interface for interacting with Slack
- **MCP Server**: Model Context Protocol server exposing Slack tools to AI agents

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 22+
- **Build**: tsdown
- **Test**: Vitest
- **Lint/Format**: Biome
- **Monorepo**: pnpm workspaces + Turbo
- **Versioning**: Changesets

## Repository Structure

```
packages/
  cyber-slack/        # Main package: CLI + MCP server
    src/
      cli.ts          # CLI entry point
      mcp.ts          # MCP server entry point
      client.ts       # Slack client wrapper
      index.ts        # Public API exports
```

## Commands

```sh
pnpm verify           # Full verification: lint + build + typecheck + test + knip
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm check            # Run Biome linting/formatting check
pnpm check:fix        # Fix linting/formatting issues
pnpm cs <script>      # Run script in packages/cyber-slack
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `SLACK_BOT_TOKEN` | Yes | Slack Bot User OAuth Token (xoxb-...) |

## Code Conventions

- Use TypeScript strict mode
- Prefer functional style
- Use named exports (not default exports)
- Test files: `*.test.ts` for unit tests, `*.system.ts` for live API tests
- Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`

## MCP Tools

Tools are registered in `src/mcp.ts`. Each tool should:

1. Check for required environment variables
2. Use the Slack client from `client.ts`
3. Return structured responses with `content` array
4. Handle errors gracefully with `isError: true`

## Adding New Tools

1. Add the tool registration in `src/mcp.ts`
2. Add tests in `src/*.test.ts`
3. Update the README tool table
4. Create a changeset: `pnpm changeset`
