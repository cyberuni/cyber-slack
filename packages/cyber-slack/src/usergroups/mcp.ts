import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { UsergroupsApi } from './api.js'

export function registerUsergroupsTools(server: McpServer, getApi: () => UsergroupsApi): void {
	server.tool(
		'slack_usergroups_list',
		'List user groups (subteams) in the workspace. Requires usergroups:read scope.',
		{
			include_users: z.boolean().optional().describe('Include list of user IDs in each group'),
			include_count: z.boolean().optional().describe('Include user count (default true)'),
			include_disabled: z.boolean().optional().describe('Include disabled/archived groups'),
		},
		async ({ include_users, include_count, include_disabled }) => {
			const api = getApi()
			const groups = await api.list({
				includeUsers: include_users,
				includeCount: include_count,
				includeDisabled: include_disabled,
			})
			return {
				content: [{ type: 'text', text: JSON.stringify(groups, null, 2) }],
			}
		},
	)

	server.tool(
		'slack_usergroups_create',
		'Create a new user group. Requires usergroups:write scope.',
		{
			name: z.string().describe('Name of the user group (e.g., "Engineering Team")'),
			handle: z.string().optional().describe('Mention handle without @ (e.g., "engineering")'),
			description: z.string().optional().describe('Purpose or description of the group'),
			channels: z.string().optional().describe('Comma-separated channel IDs for default channels'),
		},
		async ({ name, handle, description, channels }) => {
			const api = getApi()
			const group = await api.create({
				name,
				handle,
				description,
				channels: channels?.split(',').map((c) => c.trim()),
			})
			return {
				content: [{ type: 'text', text: JSON.stringify(group, null, 2) }],
			}
		},
	)

	server.tool(
		'slack_usergroups_update',
		"Update a user group's metadata. Requires usergroups:write scope.",
		{
			usergroup_id: z.string().describe('User group ID (Sxxxxxxxxxx)'),
			name: z.string().optional().describe('New name'),
			handle: z.string().optional().describe('New mention handle'),
			description: z.string().optional().describe('New description'),
			channels: z.string().optional().describe('New default channels (comma-separated IDs)'),
		},
		async ({ usergroup_id, name, handle, description, channels }) => {
			const api = getApi()
			const group = await api.update({
				usergroupId: usergroup_id,
				name,
				handle,
				description,
				channels: channels?.split(',').map((c) => c.trim()),
			})
			return {
				content: [{ type: 'text', text: JSON.stringify(group, null, 2) }],
			}
		},
	)

	server.tool(
		'slack_usergroups_users_update',
		'Update the members of a user group (replaces all existing members). Requires usergroups:write scope.',
		{
			usergroup_id: z.string().describe('User group ID (Sxxxxxxxxxx)'),
			users: z.string().describe('Comma-separated user IDs to set as members (e.g., "U123,U456,U789")'),
		},
		async ({ usergroup_id, users }) => {
			const api = getApi()
			const group = await api.updateUsers({
				usergroupId: usergroup_id,
				users: users.split(',').map((u) => u.trim()),
			})
			return {
				content: [{ type: 'text', text: JSON.stringify(group, null, 2) }],
			}
		},
	)
}
