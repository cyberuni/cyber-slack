import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { ChannelsApi, ChannelType } from './api.js'

export function registerChannelsTools(server: McpServer, getApi: () => ChannelsApi): void {
	server.tool(
		'slack_channels_list',
		'List channels in the workspace. Supports filtering by channel type.',
		{
			types: z
				.string()
				.optional()
				.describe('Comma-separated channel types: public_channel, private_channel, mpim, im (default: public_channel)'),
			limit: z.number().optional().describe('Maximum number of channels to return (default 100, max 1000)'),
			cursor: z.string().optional().describe('Pagination cursor from previous response'),
		},
		async ({ types, limit, cursor }) => {
			const api = getApi()
			const typeList = types?.split(',').map((t) => t.trim()) as ChannelType[] | undefined
			const result = await api.list({ types: typeList, limit, cursor })
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							{
								channels: result.channels,
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
}
