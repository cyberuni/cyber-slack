import { WebClient } from '@slack/web-api'

export interface SlackClientOptions {
	token: string
}

export function createSlackClient(options: SlackClientOptions): WebClient {
	return new WebClient(options.token)
}
