import { Command } from 'commander'
import type { ChannelsApi, ChannelType } from './api.js'

export function channelsCommand(getApi: () => ChannelsApi): Command {
	const cmd = new Command('channels').description('Manage Slack channels')

	cmd
		.command('list')
		.description('List channels in the workspace')
		.option(
			'-t, --types <types>',
			'Channel types (comma-separated): public_channel,private_channel,mpim,im',
			'public_channel',
		)
		.option('-l, --limit <number>', 'Maximum number of channels', '100')
		.option('-c, --cursor <cursor>', 'Pagination cursor')
		.action(async (opts) => {
			const api = getApi()
			const types = opts.types.split(',') as ChannelType[]
			const result = await api.list({
				types,
				limit: Number.parseInt(opts.limit, 10),
				cursor: opts.cursor,
			})
			for (const ch of result.channels) {
				const prefix = ch.is_private ? '🔒' : '#'
				const members = ch.num_members !== undefined ? ` (${ch.num_members} members)` : ''
				console.log(`${prefix}${ch.name} [${ch.id}]${members}`)
			}
			if (result.nextCursor) {
				console.log(`\nNext cursor: ${result.nextCursor}`)
			}
		})

	return cmd
}
