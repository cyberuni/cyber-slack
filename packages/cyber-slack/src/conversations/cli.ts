import { Command } from 'commander'
import type { ConversationsApi } from './api.js'

export function conversationsCommand(getApi: () => ConversationsApi): Command {
	const cmd = new Command('conversations').alias('conv').description('Manage Slack conversations')

	cmd
		.command('history')
		.description('Get message history from a channel')
		.argument('<channel>', 'Channel ID or name')
		.option('-l, --limit <number>', 'Maximum number of messages', '20')
		.option('-c, --cursor <cursor>', 'Pagination cursor')
		.option('--oldest <ts>', 'Only messages after this timestamp')
		.option('--latest <ts>', 'Only messages before this timestamp')
		.action(async (channel, opts) => {
			const api = getApi()
			const result = await api.history({
				channel,
				limit: Number.parseInt(opts.limit, 10),
				cursor: opts.cursor,
				oldest: opts.oldest,
				latest: opts.latest,
			})
			for (const msg of result.messages) {
				const thread = msg.thread_ts && msg.thread_ts !== msg.ts ? ` [thread: ${msg.reply_count} replies]` : ''
				console.log(`[${msg.ts}] ${msg.user ?? 'system'}: ${msg.text?.slice(0, 100)}${thread}`)
			}
			if (result.hasMore && result.nextCursor) {
				console.log(`\nMore messages available. Cursor: ${result.nextCursor}`)
			}
		})

	cmd
		.command('replies')
		.description('Get thread replies')
		.argument('<channel>', 'Channel ID')
		.argument('<ts>', 'Thread parent timestamp')
		.option('-l, --limit <number>', 'Maximum number of messages', '100')
		.option('-c, --cursor <cursor>', 'Pagination cursor')
		.action(async (channel, ts, opts) => {
			const api = getApi()
			const result = await api.replies({
				channel,
				ts,
				limit: Number.parseInt(opts.limit, 10),
				cursor: opts.cursor,
			})
			for (const msg of result.messages) {
				console.log(`[${msg.ts}] ${msg.user ?? 'system'}: ${msg.text?.slice(0, 100)}`)
			}
			if (result.hasMore && result.nextCursor) {
				console.log(`\nMore replies available. Cursor: ${result.nextCursor}`)
			}
		})

	cmd
		.command('post')
		.description('Post a message to a channel')
		.argument('<channel>', 'Channel ID or name')
		.argument('<text>', 'Message text')
		.option('-t, --thread <ts>', 'Reply to thread')
		.action(async (channel, text, opts) => {
			const api = getApi()
			const result = await api.postMessage({
				channel,
				text,
				threadTs: opts.thread,
			})
			console.log(`Message posted: ${result.ts} in ${result.channel}`)
		})

	cmd
		.command('search')
		.description('Search messages (requires user token)')
		.argument('<query>', 'Search query')
		.option('-n, --count <number>', 'Number of results', '20')
		.option('-s, --sort <sort>', 'Sort by: score or timestamp', 'score')
		.option('-d, --sort-dir <dir>', 'Sort direction: asc or desc', 'desc')
		.action(async (query, opts) => {
			const api = getApi()
			const result = await api.search({
				query,
				count: Number.parseInt(opts.count, 10),
				sort: opts.sort as 'score' | 'timestamp',
				sortDir: opts.sortDir as 'asc' | 'desc',
			})
			console.log(`Found ${result.total} messages\n`)
			for (const match of result.matches) {
				const channel = match.channel?.name ? `#${match.channel.name}` : (match.channel?.id ?? 'unknown')
				console.log(`[${channel}] ${match.user}: ${match.text?.slice(0, 100)}`)
				if (match.permalink) console.log(`  ${match.permalink}`)
			}
		})

	return cmd
}
