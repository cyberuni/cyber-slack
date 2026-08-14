# cyber-slack

Slack CLI and MCP server for AI agents.

## Installation

```sh
npm install -g cyber-slack
# or
pnpm add -g cyber-slack
```

## Setup

Set `SLACK_TOKEN` (user token) or `SLACK_BOT_TOKEN` (bot token):

```sh
# User token (xoxp-) - full access including search
export SLACK_TOKEN=xoxp-your-token-here

# Or bot token (xoxb-) - limited access, no search
export SLACK_BOT_TOKEN=xoxb-your-token-here
```

If both are set, `SLACK_TOKEN` takes precedence.

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

| Tool | Description | Token |
| --- | --- | --- |
| `slack_post_message` | Post a message to a Slack channel | Bot |
| `slack_list_channels` | List public channels in the workspace | Bot |
| `slack_search_messages` | Search for messages (supports Slack search modifiers) | User |

**Note:** `slack_search_messages` requires a user token (`xoxp-`) with `search:read` scope. Bot tokens cannot use the search API.

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
        "SLACK_TOKEN": "${SLACK_TOKEN}"
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
        "SLACK_TOKEN": "${SLACK_TOKEN}"
      }
    }
  }
}
```

## License

MIT
