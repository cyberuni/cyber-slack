import type { WebClient } from '@slack/web-api'
import { getTokenType } from '../env.js'

export interface Message {
	ts: string
	user?: string | undefined
	text?: string | undefined
	thread_ts?: string | undefined
	reply_count?: number | undefined
	type: string
}

interface HistoryOptions {
	channel: string
	limit?: number | undefined
	cursor?: string | undefined
	oldest?: string | undefined
	latest?: string | undefined
	includeAllMetadata?: boolean | undefined
}

interface HistoryResult {
	messages: Message[]
	hasMore: boolean
	nextCursor?: string | undefined
}

interface RepliesOptions {
	channel: string
	ts: string
	limit?: number | undefined
	cursor?: string | undefined
	oldest?: string | undefined
	latest?: string | undefined
}

interface PostMessageOptions {
	channel: string
	text: string
	threadTs?: string | undefined
	mrkdwn?: boolean | undefined
}

interface PostMessageResult {
	ts: string
	channel: string
}

interface SearchOptions {
	query: string
	count?: number | undefined
	sort?: 'score' | 'timestamp' | undefined
	sortDir?: 'asc' | 'desc' | undefined
}

interface SearchMatch {
	channel?: { id?: string; name?: string } | undefined
	user?: string | undefined
	text?: string | undefined
	ts?: string | undefined
	permalink?: string | undefined
}

interface SearchResult {
	total: number
	matches: SearchMatch[]
}

export interface ConversationsApi {
	history(options: HistoryOptions): Promise<HistoryResult>
	replies(options: RepliesOptions): Promise<HistoryResult>
	postMessage(options: PostMessageOptions): Promise<PostMessageResult>
	search(options: SearchOptions): Promise<SearchResult>
}

export function createConversationsApi(client: WebClient): ConversationsApi {
	return {
		async history(options) {
			const result = await client.conversations.history({
				channel: options.channel,
				limit: options.limit ?? 100,
				cursor: options.cursor,
				oldest: options.oldest,
				latest: options.latest,
				include_all_metadata: options.includeAllMetadata,
			})
			const messages: Message[] =
				result.messages?.map((m) => ({
					ts: m.ts ?? '',
					user: m.user,
					text: m.text,
					thread_ts: m.thread_ts,
					reply_count: m.reply_count,
					type: m.type ?? 'message',
				})) ?? []
			return {
				messages,
				hasMore: result.has_more ?? false,
				nextCursor: result.response_metadata?.next_cursor,
			}
		},

		async replies(options) {
			const result = await client.conversations.replies({
				channel: options.channel,
				ts: options.ts,
				limit: options.limit ?? 100,
				cursor: options.cursor,
				oldest: options.oldest,
				latest: options.latest,
			})
			const messages: Message[] =
				result.messages?.map((m) => ({
					ts: m.ts ?? '',
					user: m.user,
					text: m.text,
					thread_ts: m.thread_ts,
					reply_count: m.reply_count,
					type: m.type ?? 'message',
				})) ?? []
			return {
				messages,
				hasMore: result.has_more ?? false,
				nextCursor: result.response_metadata?.next_cursor,
			}
		},

		async postMessage(options) {
			const result = await client.chat.postMessage({
				channel: options.channel,
				text: options.text,
				thread_ts: options.threadTs,
				mrkdwn: options.mrkdwn ?? true,
			})
			return {
				ts: result.ts ?? '',
				channel: result.channel ?? options.channel,
			}
		},

		async search(options) {
			const tokenType = getTokenType()
			if (tokenType === 'bot') {
				throw new Error('search.messages requires a user token (xoxp-). Bot tokens cannot use this API.')
			}
			const result = await client.search.messages({
				query: options.query,
				count: options.count ?? 20,
				sort: options.sort ?? 'score',
				sort_dir: options.sortDir ?? 'desc',
			})
			const matches: SearchMatch[] =
				result.messages?.matches?.map((m) => ({
					channel: m.channel ? { id: m.channel.id, name: m.channel.name } : undefined,
					user: m.user,
					text: m.text,
					ts: m.ts,
					permalink: m.permalink,
				})) ?? []
			return {
				total: result.messages?.total ?? 0,
				matches,
			}
		},
	}
}
