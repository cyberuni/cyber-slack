# cyber-slack

Slack CLI and MCP server for AI agents. Follows the AXI (API + CLI + MCP) pattern.

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
   - `channels:history` - Read channel history
   - `users:read` - List users
   - `users:read.email` - Read user emails
   - `search:read` - Search messages (user token only)
   - `reactions:write` - Add/remove reactions
   - `usergroups:read` - List user groups
   - `usergroups:write` - Create/update user groups
3. Install the app to your workspace
4. Copy the "Bot User OAuth Token" or "User OAuth Token"

## CLI Usage

```sh
cyber-slack                              # show auth status
cyber-slack mcp                          # start MCP server

# Channels
cyber-slack channels list                # list public channels
cyber-slack channels list -t public_channel,private_channel

# Conversations
cyber-slack conversations history <channel>
cyber-slack conversations replies <channel> <thread_ts>
cyber-slack conversations post <channel> "message"
cyber-slack conversations search "query"  # requires user token

# Users
cyber-slack users list
cyber-slack users info <user_id>
cyber-slack users search "query"

# Reactions
cyber-slack reactions add <channel> <timestamp> thumbsup
cyber-slack reactions remove <channel> <timestamp> thumbsup

# User Groups
cyber-slack usergroups list
cyber-slack usergroups create "Team Name" --handle team
cyber-slack usergroups update <group_id> --name "New Name"
cyber-slack usergroups set-users <group_id> U123,U456
```

## MCP Server

### Tools

| Tool | Description | Token |
| --- | --- | --- |
| `slack_channels_list` | List channels (public, private, DM, group) | Bot/User |
| `slack_conversations_history` | Get message history from a channel | Bot/User |
| `slack_conversations_replies` | Get thread replies | Bot/User |
| `slack_conversations_post` | Post a message | Bot/User |
| `slack_conversations_search` | Search messages with modifiers | User |
| `slack_users_list` | List workspace users | Bot/User |
| `slack_users_info` | Get user details | Bot/User |
| `slack_users_search` | Search users by name/email | Bot/User |
| `slack_reactions_add` | Add emoji reaction | Bot/User |
| `slack_reactions_remove` | Remove emoji reaction | Bot/User |
| `slack_usergroups_list` | List user groups | Bot/User |
| `slack_usergroups_create` | Create user group | User |
| `slack_usergroups_update` | Update user group | User |
| `slack_usergroups_users_update` | Set group members | User |

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
