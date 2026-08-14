import { describe, expect, it } from 'vitest'
import { createSlackClient } from './client.js'

describe('createSlackClient', () => {
	it('creates a WebClient instance', () => {
		const client = createSlackClient({ token: 'xoxb-test-token' })
		expect(client).toBeDefined()
	})
})
