import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { createSlackClient } from './client.js'

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN

export async function runMcpServer(): Promise<void> {
	const server = new McpServer({
		name: 'cyber-slack',
		version: '0.1.0',
	})

	server.tool(
		'slack_post_message',
		'Post a message to a Slack channel',
		{
			channel: z.string().describe('Channel ID or name'),
			text: z.string().describe('Message text'),
		},
		async ({ channel, text }) => {
			if (!SLACK_BOT_TOKEN) {
				return {
					content: [{ type: 'text', text: 'Error: SLACK_BOT_TOKEN is not set' }],
					isError: true,
				}
			}
			const client = createSlackClient({ token: SLACK_BOT_TOKEN })
			const result = await client.chat.postMessage({ channel, text })
			return {
				content: [{ type: 'text', text: `Message posted: ${result.ts}` }],
			}
		},
	)

	server.tool(
		'slack_list_channels',
		'List public channels in the workspace',
		{
			limit: z.number().optional().describe('Maximum number of channels to return (default 100)'),
		},
		async ({ limit }) => {
			if (!SLACK_BOT_TOKEN) {
				return {
					content: [{ type: 'text', text: 'Error: SLACK_BOT_TOKEN is not set' }],
					isError: true,
				}
			}
			const client = createSlackClient({ token: SLACK_BOT_TOKEN })
			const result = await client.conversations.list({
				types: 'public_channel',
				limit: limit ?? 100,
			})
			const channels = result.channels?.map((c) => ({ id: c.id, name: c.name })) ?? []
			return {
				content: [{ type: 'text', text: JSON.stringify(channels, null, 2) }],
			}
		},
	)

	const transport = new StdioServerTransport()
	await server.connect(transport)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runMcpServer().catch(console.error)
}
