import type { WebClient } from '@slack/web-api'

interface AddReactionOptions {
	channel: string
	timestamp: string
	emoji: string
}

interface RemoveReactionOptions {
	channel: string
	timestamp: string
	emoji: string
}

export interface ReactionsApi {
	add(options: AddReactionOptions): Promise<void>
	remove(options: RemoveReactionOptions): Promise<void>
}

export function createReactionsApi(client: WebClient): ReactionsApi {
	return {
		async add(options) {
			await client.reactions.add({
				channel: options.channel,
				timestamp: options.timestamp,
				name: options.emoji,
			})
		},

		async remove(options) {
			await client.reactions.remove({
				channel: options.channel,
				timestamp: options.timestamp,
				name: options.emoji,
			})
		},
	}
}
