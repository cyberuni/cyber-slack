import { Command } from 'commander'
import type { ReactionsApi } from './api.js'

export function reactionsCommand(getApi: () => ReactionsApi): Command {
	const cmd = new Command('reactions').alias('react').description('Manage emoji reactions')

	cmd
		.command('add')
		.description('Add an emoji reaction to a message')
		.argument('<channel>', 'Channel ID')
		.argument('<timestamp>', 'Message timestamp (e.g., 1234567890.123456)')
		.argument('<emoji>', 'Emoji name without colons (e.g., thumbsup, heart)')
		.action(async (channel, timestamp, emoji) => {
			const api = getApi()
			await api.add({ channel, timestamp, emoji })
			console.log(`Added :${emoji}: reaction`)
		})

	cmd
		.command('remove')
		.description('Remove an emoji reaction from a message')
		.argument('<channel>', 'Channel ID')
		.argument('<timestamp>', 'Message timestamp')
		.argument('<emoji>', 'Emoji name without colons')
		.action(async (channel, timestamp, emoji) => {
			const api = getApi()
			await api.remove({ channel, timestamp, emoji })
			console.log(`Removed :${emoji}: reaction`)
		})

	return cmd
}
