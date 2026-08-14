import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { ConversationsApi } from './api.js'

export function registerConversationsTools(server: McpServer, getApi: () => ConversationsApi): void {
	server.tool(
		'slack_conversations_history',
		'Get message history from a channel or DM. Returns messages in reverse chronological order.',
		{
			channel: z.string().describe('Channel ID (Cxxxxxxxxxx) or name (#channel, @user for DM)'),
			limit: z.number().optional().describe('Maximum messages to return (default 20, max 100)'),
			cursor: z.string().optional().describe('Pagination cursor from previous response'),
			oldest: z.string().optional().describe('Only messages after this Unix timestamp'),
			latest: z.string().optional().describe('Only messages before this Unix timestamp'),
		},
		async ({ channel, limit, cursor, oldest, latest }) => {
			const api = getApi()
			const result = await api.history({ channel, limit, cursor, oldest, latest })
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								messages: result.messages,
								has_more: result.hasMore,
								next_cursor: result.nextCursor,
							},
							null,
							2,
						),
					},
				],
			}
		},
	)

	server.tool(
		'slack_conversations_replies',
		'Get thread replies for a message.',
		{
			channel: z.string().describe('Channel ID where the thread exists'),
			ts: z.string().describe('Timestamp of the parent message (e.g., 1234567890.123456)'),
			limit: z.number().optional().describe('Maximum replies to return (default 100)'),
			cursor: z.string().optional().describe('Pagination cursor'),
		},
		async ({ channel, ts, limit, cursor }) => {
			const api = getApi()
			const result = await api.replies({ channel, ts, limit, cursor })
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								messages: result.messages,
								has_more: result.hasMore,
								next_cursor: result.nextCursor,
							},
							null,
							2,
						),
					},
				],
			}
		},
	)

	server.tool(
		'slack_conversations_post',
		'Post a message to a channel or DM. Supports markdown formatting.',
		{
			channel: z.string().describe('Channel ID or name (#channel, @user for DM)'),
			text: z.string().describe('Message text (supports Slack markdown)'),
			thread_ts: z.string().optional().describe('Reply to thread - timestamp of parent message'),
		},
		async ({ channel, text, thread_ts }) => {
			const api = getApi()
			const result = await api.postMessage({ channel, text, threadTs: thread_ts })
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify({ ts: result.ts, channel: result.channel }),
					},
				],
			}
		},
	)

	server.tool(
		'slack_conversations_search',
		'Search for messages. Requires user token (xoxp-). Supports Slack search modifiers (from:, in:, has:, before:, after:).',
		{
			query: z
				.string()
				.describe('Search query with optional modifiers (from:user, in:channel, has:link, before:date, after:date)'),
			count: z.number().optional().describe('Number of results (default 20, max 100)'),
			sort: z.enum(['score', 'timestamp']).optional().describe('Sort by relevance or time (default: score)'),
			sort_dir: z.enum(['asc', 'desc']).optional().describe('Sort direction (default: desc)'),
		},
		async ({ query, count, sort, sort_dir }) => {
			const api = getApi()
			try {
				const result = await api.search({ query, count, sort, sortDir: sort_dir })
				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify({ total: result.total, matches: result.matches }, null, 2),
						},
					],
				}
			} catch (error) {
				if (error instanceof Error && error.message.includes('user token')) {
					return {
						content: [{ type: 'text', text: error.message }],
						isError: true,
					}
				}
				throw error
			}
		},
	)
}
