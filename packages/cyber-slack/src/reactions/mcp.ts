import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { ReactionsApi } from './api.js'

export function registerReactionsTools(server: McpServer, getApi: () => ReactionsApi): void {
	server.tool(
		'slack_reactions_add',
		'Add an emoji reaction to a message.',
		{
			channel: z.string().describe('Channel ID (Cxxxxxxxxxx)'),
			timestamp: z.string().describe('Message timestamp (e.g., 1234567890.123456)'),
			emoji: z.string().describe('Emoji name without colons (e.g., thumbsup, heart, rocket)'),
		},
		async ({ channel, timestamp, emoji }) => {
			const api = getApi()
			await api.add({ channel, timestamp, emoji })
			return {
				content: [{ type: 'text', text: `Added :${emoji}: reaction` }],
			}
		},
	)

	server.tool(
		'slack_reactions_remove',
		'Remove an emoji reaction from a message.',
		{
			channel: z.string().describe('Channel ID (Cxxxxxxxxxx)'),
			timestamp: z.string().describe('Message timestamp (e.g., 1234567890.123456)'),
			emoji: z.string().describe('Emoji name without colons'),
		},
		async ({ channel, timestamp, emoji }) => {
			const api = getApi()
			await api.remove({ channel, timestamp, emoji })
			return {
				content: [{ type: 'text', text: `Removed :${emoji}: reaction` }],
			}
		},
	)
}
