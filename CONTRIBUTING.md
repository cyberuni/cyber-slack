# Contributing

Guide for developing `cyber-slack` locally. AI coding assistants should also read [AGENTS.md](AGENTS.md).

## Setup

```sh
pnpm install
export SLACK_BOT_TOKEN=<your-bot-token>   # required for system tests
```

## Build and test

```sh
pnpm verify                             # lint + build + typecheck + test + knip
pnpm cs dev mcp                         # run MCP server without building (tsx)
pnpm cs test:system                     # live API tests (requires SLACK_SYSTEM_TEST=1)
```

`pnpm cs <script>` is the root shortcut for `pnpm run --filter=./packages/cyber-slack <script>`;
`dev`, `test:system` and `test:watch` live on the package, not the workspace root.

See [AGENTS.md](AGENTS.md) for the full command list, architecture, and conventions.

## MCP server

When working in this source tree, `import('cyber-slack/mcp')` does not resolve — there is no `node_modules/cyber-slack` self-link. Build first, then point MCP hosts at the built entry under `packages/cyber-slack/dist/`.

```sh
pnpm build
```

| Context | `command` | `args` |
| --- | --- | --- |
| MCP host (Cursor, Claude Desktop, etc.) | `node` | `["packages/cyber-slack/dist/cli.js", "mcp"]` or `["packages/cyber-slack/dist/mcp.js"]` |
| MCP Inspector | `node` | `["packages/cyber-slack/dist/cli.js", "mcp"]` |

### Cursor

In `~/.cursor/mcp.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cyber-slack": {
      "command": "node",
      "args": ["/absolute/path/to/cyber-slack/packages/cyber-slack/dist/mcp.js"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

Reload MCP servers after changes.

### MCP Inspector

Debug tools and schemas without an agent host. UI defaults to [http://localhost:6274](http://localhost:6274).

```sh
pnpm build
npx @modelcontextprotocol/inspector \
  -e SLACK_BOT_TOKEN="$SLACK_BOT_TOKEN" \
  -- node packages/cyber-slack/dist/cli.js mcp
```

Consumer MCP setup (installed package) is documented in [readme.md](readme.md#mcp-server).
