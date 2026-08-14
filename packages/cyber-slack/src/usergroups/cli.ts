import { Command } from 'commander'
import type { UsergroupsApi } from './api.js'

export function usergroupsCommand(getApi: () => UsergroupsApi): Command {
	const cmd = new Command('usergroups').alias('ug').description('Manage Slack user groups')

	cmd
		.command('list')
		.description('List user groups in the workspace')
		.option('--include-users', 'Include list of user IDs in each group')
		.option('--include-disabled', 'Include disabled groups')
		.action(async (opts) => {
			const api = getApi()
			const groups = await api.list({
				includeUsers: opts.includeUsers,
				includeDisabled: opts.includeDisabled,
			})
			for (const group of groups) {
				const members = group.userCount !== undefined ? ` (${group.userCount} members)` : ''
				console.log(`@${group.handle} - ${group.name}${members} [${group.id}]`)
				if (group.description) console.log(`  ${group.description}`)
			}
		})

	cmd
		.command('create')
		.description('Create a new user group')
		.argument('<name>', 'Group name')
		.option('-h, --handle <handle>', 'Mention handle without @')
		.option('-d, --description <description>', 'Group description')
		.option('-c, --channels <channels>', 'Default channel IDs (comma-separated)')
		.action(async (name, opts) => {
			const api = getApi()
			const group = await api.create({
				name,
				handle: opts.handle,
				description: opts.description,
				channels: opts.channels?.split(','),
			})
			console.log(`Created user group: @${group.handle} [${group.id}]`)
		})

	cmd
		.command('update')
		.description('Update a user group')
		.argument('<usergroup-id>', 'User group ID (Sxxxxxxxxxx)')
		.option('-n, --name <name>', 'New name')
		.option('-h, --handle <handle>', 'New handle')
		.option('-d, --description <description>', 'New description')
		.action(async (usergroupId, opts) => {
			const api = getApi()
			const group = await api.update({
				usergroupId,
				name: opts.name,
				handle: opts.handle,
				description: opts.description,
			})
			console.log(`Updated user group: @${group.handle} [${group.id}]`)
		})

	cmd
		.command('set-users')
		.description('Set the members of a user group (replaces existing members)')
		.argument('<usergroup-id>', 'User group ID')
		.argument('<users>', 'User IDs (comma-separated)')
		.action(async (usergroupId, users) => {
			const api = getApi()
			const group = await api.updateUsers({
				usergroupId,
				users: users.split(','),
			})
			console.log(`Updated members for @${group.handle}`)
		})

	return cmd
}
