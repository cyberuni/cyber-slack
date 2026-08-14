import { WebClient } from '@slack/web-api'
import { requireToken } from './env.js'

let clientInstance: WebClient | undefined

export function createSlackClient(token?: string | undefined): WebClient {
	return new WebClient(token ?? requireToken())
}

export function getClient(): WebClient {
	clientInstance ??= createSlackClient()
	return clientInstance
}

export function resetClient(): void {
	clientInstance = undefined
}
