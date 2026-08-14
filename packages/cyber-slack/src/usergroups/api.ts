import type { WebClient } from '@slack/web-api'

export interface Usergroup {
	id: string
	name: string
	handle: string
	description?: string | undefined
	userCount?: number | undefined
	users?: string[] | undefined
	isExternal: boolean
}

interface ListUsergroupsOptions {
	includeUsers?: boolean | undefined
	includeCount?: boolean | undefined
	includeDisabled?: boolean | undefined
}

interface CreateUsergroupOptions {
	name: string
	handle?: string | undefined
	description?: string | undefined
	channels?: string[] | undefined
}

interface UpdateUsergroupOptions {
	usergroupId: string
	name?: string | undefined
	handle?: string | undefined
	description?: string | undefined
	channels?: string[] | undefined
}

interface UpdateUsergroupUsersOptions {
	usergroupId: string
	users: string[]
}

export interface UsergroupsApi {
	list(options?: ListUsergroupsOptions | undefined): Promise<Usergroup[]>
	create(options: CreateUsergroupOptions): Promise<Usergroup>
	update(options: UpdateUsergroupOptions): Promise<Usergroup>
	updateUsers(options: UpdateUsergroupUsersOptions): Promise<Usergroup>
}

export function createUsergroupsApi(client: WebClient): UsergroupsApi {
	const mapUsergroup = (ug: {
		id?: string
		name?: string
		handle?: string
		description?: string
		user_count?: number
		users?: string[]
		is_external?: boolean
	}): Usergroup => ({
		id: ug.id ?? '',
		name: ug.name ?? '',
		handle: ug.handle ?? '',
		description: ug.description,
		userCount: ug.user_count,
		users: ug.users,
		isExternal: ug.is_external ?? false,
	})

	return {
		async list(options) {
			const result = await client.usergroups.list({
				include_users: options?.includeUsers ?? false,
				include_count: options?.includeCount ?? true,
				include_disabled: options?.includeDisabled ?? false,
			})
			return result.usergroups?.map(mapUsergroup) ?? []
		},

		async create(options) {
			const result = await client.usergroups.create({
				name: options.name,
				handle: options.handle,
				description: options.description,
				channels: options.channels?.join(','),
			})
			if (!result.usergroup) {
				throw new Error('Failed to create usergroup')
			}
			return mapUsergroup(result.usergroup)
		},

		async update(options) {
			const result = await client.usergroups.update({
				usergroup: options.usergroupId,
				name: options.name,
				handle: options.handle,
				description: options.description,
				channels: options.channels?.join(','),
			})
			if (!result.usergroup) {
				throw new Error('Failed to update usergroup')
			}
			return mapUsergroup(result.usergroup)
		},

		async updateUsers(options) {
			const result = await client.usergroups.users.update({
				usergroup: options.usergroupId,
				users: options.users.join(','),
			})
			if (!result.usergroup) {
				throw new Error('Failed to update usergroup users')
			}
			return mapUsergroup(result.usergroup)
		},
	}
}
