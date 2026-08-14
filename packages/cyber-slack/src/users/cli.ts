import { Command } from 'commander'
import type { UsersApi } from './api.js'

export function usersCommand(getApi: () => UsersApi): Command {
	const cmd = new Command('users').alias('user').description('Manage Slack users')

	cmd
		.command('list')
		.description('List users in the workspace')
		.option('-l, --limit <number>', 'Maximum users to return', '100')
		.option('-c, --cursor <cursor>', 'Pagination cursor')
		.action(async (opts) => {
			const api = getApi()
			const result = await api.list({
				limit: Number.parseInt(opts.limit, 10),
				cursor: opts.cursor,
			})
			for (const user of result.users) {
				if (user.deleted) continue
				const name = user.displayName || user.realName || user.name
				const role = user.isAdmin ? ' (admin)' : user.isBot ? ' (bot)' : ''
				console.log(`@${user.name} - ${name}${role} [${user.id}]`)
			}
			if (result.nextCursor) {
				console.log(`\nNext cursor: ${result.nextCursor}`)
			}
		})

	cmd
		.command('info')
		.description('Get user details')
		.argument('<user>', 'User ID')
		.action(async (userId) => {
			const api = getApi()
			const user = await api.info(userId)
			console.log(`ID: ${user.id}`)
			console.log(`Username: @${user.name}`)
			if (user.realName) console.log(`Real Name: ${user.realName}`)
			if (user.displayName) console.log(`Display Name: ${user.displayName}`)
			if (user.email) console.log(`Email: ${user.email}`)
			if (user.title) console.log(`Title: ${user.title}`)
			console.log(`Bot: ${user.isBot}`)
			console.log(`Admin: ${user.isAdmin}`)
		})

	cmd
		.command('search')
		.description('Search for users by name, email, or display name')
		.argument('<query>', 'Search query')
		.option('-l, --limit <number>', 'Maximum results', '10')
		.action(async (query, opts) => {
			const api = getApi()
			const users = await api.search(query, Number.parseInt(opts.limit, 10))
			if (users.length === 0) {
				console.log('No users found')
				return
			}
			for (const user of users) {
				const name = user.displayName || user.realName || user.name
				console.log(`@${user.name} - ${name} [${user.id}]`)
				if (user.email) console.log(`  Email: ${user.email}`)
			}
		})

	return cmd
}
