import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { UsersApi } from './api.js'

export function registerUsersTools(server: McpServer, getApi: () => UsersApi): void {
	server.tool(
		'slack_users_list',
		'List users in the workspace.',
		{
			limit: z.number().optional().describe('Maximum users to return (default 100)'),
			cursor: z.string().optional().describe('Pagination cursor'),
		},
		async ({ limit, cursor }) => {
			const api = getApi()
			const result = await api.list({ limit, cursor })
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								users: result.users,
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
		'slack_users_info',
		'Get detailed information about a user.',
		{
			user_id: z.string().describe('User ID (Uxxxxxxxxxx)'),
		},
		async ({ user_id }) => {
			const api = getApi()
			const user = await api.info(user_id)
			return {
				content: [{ type: 'text', text: JSON.stringify(user, null, 2) }],
			}
		},
	)

	server.tool(
		'slack_users_search',
		'Search for users by name, email, or display name.',
		{
			query: z.string().describe('Search query - matches against name, display name, real name, or email'),
			limit: z.number().optional().describe('Maximum results (default 10, max 100)'),
		},
		async ({ query, limit }) => {
			const api = getApi()
			const users = await api.search(query, limit)
			return {
				content: [{ type: 'text', text: JSON.stringify(users, null, 2) }],
			}
		},
	)
}
