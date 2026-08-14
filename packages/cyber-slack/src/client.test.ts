import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSlackClient, getClient, resetClient } from './client.js'

describe('createSlackClient', () => {
	it('creates a WebClient instance with provided token', () => {
		const client = createSlackClient('xoxb-test-token')
		expect(client).toBeDefined()
	})
})

describe('getClient', () => {
	beforeEach(() => {
		resetClient()
		vi.stubEnv('SLACK_TOKEN', 'xoxp-test-token')
	})

	afterEach(() => {
		vi.unstubAllEnvs()
		resetClient()
	})

	it('returns a singleton client', () => {
		const client1 = getClient()
		const client2 = getClient()
		expect(client1).toBe(client2)
	})
})
