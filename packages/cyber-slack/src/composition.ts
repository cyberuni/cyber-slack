import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Command } from 'commander'
import { type ChannelsApi, createChannelsApi } from './channels/api.js'
import { channelsCommand } from './channels/cli.js'
import { registerChannelsTools } from './channels/mcp.js'
import { getClient } from './client.js'
import { type ConversationsApi, createConversationsApi } from './conversations/api.js'
import { conversationsCommand } from './conversations/cli.js'
import { registerConversationsTools } from './conversations/mcp.js'
import { createReactionsApi, type ReactionsApi } from './reactions/api.js'
import { reactionsCommand } from './reactions/cli.js'
import { registerReactionsTools } from './reactions/mcp.js'
import { createUsergroupsApi, type UsergroupsApi } from './usergroups/api.js'
import { usergroupsCommand } from './usergroups/cli.js'
import { registerUsergroupsTools } from './usergroups/mcp.js'
import { createUsersApi, type UsersApi } from './users/api.js'
import { usersCommand } from './users/cli.js'
import { registerUsersTools } from './users/mcp.js'

export interface RuntimeContext {
	channels: ChannelsApi
	conversations: ConversationsApi
	reactions: ReactionsApi
	users: UsersApi
	usergroups: UsergroupsApi
}

export function createRuntimeContext(): RuntimeContext {
	const client = getClient()
	return {
		channels: createChannelsApi(client),
		conversations: createConversationsApi(client),
		reactions: createReactionsApi(client),
		users: createUsersApi(client),
		usergroups: createUsergroupsApi(client),
	}
}

export function registerCliCommands(program: Command, getContext: () => RuntimeContext): void {
	program.addCommand(channelsCommand(() => getContext().channels))
	program.addCommand(conversationsCommand(() => getContext().conversations))
	program.addCommand(reactionsCommand(() => getContext().reactions))
	program.addCommand(usersCommand(() => getContext().users))
	program.addCommand(usergroupsCommand(() => getContext().usergroups))
}

export function registerMcpTools(server: McpServer, getContext: () => RuntimeContext): void {
	registerChannelsTools(server, () => getContext().channels)
	registerConversationsTools(server, () => getContext().conversations)
	registerReactionsTools(server, () => getContext().reactions)
	registerUsersTools(server, () => getContext().users)
	registerUsergroupsTools(server, () => getContext().usergroups)
}
