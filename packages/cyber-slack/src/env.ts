export function getSlackToken(): string | undefined {
	return process.env.SLACK_TOKEN ?? process.env.SLACK_BOT_TOKEN
}

export function getTokenType(): 'user' | 'bot' | undefined {
	const token = getSlackToken()
	if (!token) return undefined
	if (token.startsWith('xoxp-')) return 'user'
	if (token.startsWith('xoxb-')) return 'bot'
	return undefined
}

export function requireToken(): string {
	const token = getSlackToken()
	if (!token) {
		throw new Error('SLACK_TOKEN or SLACK_BOT_TOKEN environment variable is required')
	}
	return token
}
