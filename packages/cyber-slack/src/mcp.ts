import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { createSlackClient } from './client.js'

const SLACK_TOKEN = process.env.SLACK_TOKEN ?? process.env.SLACK_BOT_TOKEN

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
			if (!SLACK_TOKEN) {
				return {
					content: [{ type: 'text', text: 'Error: SLACK_TOKEN or SLACK_BOT_TOKEN is not set' }],
					isError: true,
				}
			}
			const client = createSlackClient({ token: SLACK_TOKEN })
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
			if (!SLACK_TOKEN) {
				return {
					content: [{ type: 'text', text: 'Error: SLACK_TOKEN or SLACK_BOT_TOKEN is not set' }],
					isError: true,
				}
			}
			const client = createSlackClient({ token: SLACK_TOKEN })
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

	server.tool(
		'slack_search_messages',
		'Search for messages in Slack. Requires a user token (xoxp-) with search:read scope, not a bot token.',
		{
			query: z
				.string()
				.describe('Search query (supports Slack search modifiers like from:, in:, has:, before:, after:)'),
			count: z.number().optional().describe('Number of results per page (default 20, max 100)'),
			sort: z
				.enum(['score', 'timestamp'])
				.optional()
				.describe('Sort order: score (relevance) or timestamp (default: score)'),
			sort_dir: z.enum(['asc', 'desc']).optional().describe('Sort direction (default: desc)'),
		},
		async ({ query, count, sort, sort_dir }) => {
			if (!SLACK_TOKEN) {
				return {
					content: [{ type: 'text', text: 'Error: SLACK_TOKEN or SLACK_BOT_TOKEN is not set' }],
					isError: true,
				}
			}
			const client = createSlackClient({ token: SLACK_TOKEN })
			try {
				const result = await client.search.messages({
					query,
					count: count ?? 20,
					sort: sort ?? 'score',
					sort_dir: sort_dir ?? 'desc',
				})
				const messages =
					result.messages?.matches?.map((m) => ({
						channel: m.channel?.name,
						user: m.user,
						text: m.text,
						ts: m.ts,
						permalink: m.permalink,
					})) ?? []
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify({ total: result.messages?.total ?? 0, messages }, null, 2),
						},
					],
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error)
				if (message.includes('missing_scope') || message.includes('not_allowed_token_type')) {
					return {
						content: [
							{
								type: 'text',
								text: 'Error: search.messages requires a user token (xoxp-) with search:read scope. Bot tokens cannot use this endpoint.',
							},
						],
						isError: true,
					}
				}
				throw error
			}
		},
	)

	const transport = new StdioServerTransport()
	await server.connect(transport)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runMcpServer().catch(console.error)
}
