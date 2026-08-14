import type { WebClient } from '@slack/web-api'

export type ChannelType = 'public_channel' | 'private_channel' | 'mpim' | 'im'

interface ListChannelsOptions {
	types?: ChannelType[] | undefined
	limit?: number | undefined
	cursor?: string | undefined
}

export interface Channel {
	id: string
	name: string
	is_channel: boolean
	is_private: boolean
	is_mpim: boolean
	is_im: boolean
	num_members?: number | undefined
}

interface ListChannelsResult {
	channels: Channel[]
	nextCursor?: string | undefined
}

export interface ChannelsApi {
	list(options?: ListChannelsOptions | undefined): Promise<ListChannelsResult>
}

export function createChannelsApi(client: WebClient): ChannelsApi {
	return {
		async list(options) {
			const types = options?.types?.join(',') ?? 'public_channel'
			const result = await client.conversations.list({
				types,
				limit: options?.limit ?? 100,
				cursor: options?.cursor,
			})
			const channels: Channel[] =
				result.channels?.map((c) => ({
					id: c.id ?? '',
					name: c.name ?? '',
					is_channel: c.is_channel ?? false,
					is_private: c.is_private ?? false,
					is_mpim: c.is_mpim ?? false,
					is_im: c.is_im ?? false,
					num_members: c.num_members,
				})) ?? []
			return {
				channels,
				nextCursor: result.response_metadata?.next_cursor || undefined,
			}
		},
	}
}
