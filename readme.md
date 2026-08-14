# cyber-slack

Slack CLI and MCP server for AI agents.

## Installation

```sh
npm install -g cyber-slack
# or
pnpm add -g cyber-slack
```

## Setup

Set the `SLACK_BOT_TOKEN` environment variable with your Slack Bot User OAuth Token (starts with `xoxb-`).

```sh
export SLACK_BOT_TOKEN=xoxb-your-token-here
```

### Creating a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app
2. Under "OAuth & Permissions", add the required scopes:
   - `chat:write` - Post messages
   - `channels:read` - List channels
   - `channels:history` - Read channel history (optional)
3. Install the app to your workspace
4. Copy the "Bot User OAuth Token"

## CLI Usage

```sh
cyber-slack mcp   # Start the MCP server
```

## MCP Server

### Tools

| Tool | Description |
| --- | --- |
| `slack_post_message` | Post a message to a Slack channel |
| `slack_list_channels` | List public channels in the workspace |

### Configuration

#### Claude Desktop / Cursor

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "cyber-slack": {
      "command": "npx",
      "args": ["cyber-slack", "mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "cyber-slack": {
      "command": "cyber-slack",
      "args": ["mcp"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

## License

MIT
