import type { WebClient } from '@slack/web-api'

export interface User {
	id: string
	name: string
	realName?: string | undefined
	displayName?: string | undefined
	email?: string | undefined
	title?: string | undefined
	isBot: boolean
	isAdmin: boolean
	deleted: boolean
}

interface ListUsersOptions {
	limit?: number | undefined
	cursor?: string | undefined
}

interface ListUsersResult {
	users: User[]
	nextCursor?: string | undefined
}

export interface UsersApi {
	list(options?: ListUsersOptions | undefined): Promise<ListUsersResult>
	info(userId: string): Promise<User>
	search(query: string, limit?: number | undefined): Promise<User[]>
}

export function createUsersApi(client: WebClient): UsersApi {
	const mapUser = (u: {
		id?: string
		name?: string
		real_name?: string
		profile?: { display_name?: string; email?: string; title?: string }
		is_bot?: boolean
		is_admin?: boolean
		deleted?: boolean
	}): User => ({
		id: u.id ?? '',
		name: u.name ?? '',
		realName: u.real_name,
		displayName: u.profile?.display_name,
		email: u.profile?.email,
		title: u.profile?.title,
		isBot: u.is_bot ?? false,
		isAdmin: u.is_admin ?? false,
		deleted: u.deleted ?? false,
	})

	return {
		async list(options) {
			const result = await client.users.list({
				limit: options?.limit ?? 100,
				cursor: options?.cursor,
			})
			const users = result.members?.map(mapUser) ?? []
			return {
				users,
				nextCursor: result.response_metadata?.next_cursor || undefined,
			}
		},

		async info(userId) {
			const result = await client.users.info({ user: userId })
			if (!result.user) {
				throw new Error(`User not found: ${userId}`)
			}
			return mapUser(result.user)
		},

		async search(query, limit = 10) {
			const allUsers = await client.users.list({ limit: 1000 })
			const lowerQuery = query.toLowerCase()
			const matches =
				allUsers.members
					?.filter((u) => {
						const name = u.name?.toLowerCase() ?? ''
						const realName = u.real_name?.toLowerCase() ?? ''
						const displayName = u.profile?.display_name?.toLowerCase() ?? ''
						const email = u.profile?.email?.toLowerCase() ?? ''
						return (
							name.includes(lowerQuery) ||
							realName.includes(lowerQuery) ||
							displayName.includes(lowerQuery) ||
							email.includes(lowerQuery)
						)
					})
					.slice(0, limit)
					.map(mapUser) ?? []
			return matches
		},
	}
}
