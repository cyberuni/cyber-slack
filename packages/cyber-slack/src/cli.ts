#!/usr/bin/env node

import { Command } from 'commander'
import { createRuntimeContext, type RuntimeContext, registerCliCommands } from './composition.js'
import { getSlackToken, getTokenType } from './env.js'
import { runMcpServer } from './mcp.js'

const program = new Command()
let runtimeContext: RuntimeContext | undefined

function getRuntimeContext(): RuntimeContext {
	runtimeContext ??= createRuntimeContext()
	return runtimeContext
}

program
	.name('cyber-slack')
	.description('Slack CLI and MCP server for AI agents')
	.version('0.1.0')
	.addHelpText(
		'after',
		[
			'',
			'Authentication: set SLACK_TOKEN (user token, xoxp-) or SLACK_BOT_TOKEN (bot token, xoxb-).',
			'User tokens have full access; bot tokens have limited access (no search).',
			'',
			'Examples:',
			'  cyber-slack channels list',
			'  cyber-slack conversations history C1234567890',
			'  cyber-slack conversations search "keyword"',
			'  cyber-slack users search "john"',
			'  cyber-slack mcp                           # start MCP server',
		].join('\n'),
	)
	.action(() => {
		const token = getSlackToken()
		if (!token) {
			console.log('SLACK_TOKEN or SLACK_BOT_TOKEN not set')
			console.log('Run: cyber-slack --help')
			return
		}
		const tokenType = getTokenType()
		console.log(`Authenticated with ${tokenType} token`)
	})

program
	.command('mcp')
	.description('Start the MCP server')
	.action(async () => {
		await runMcpServer()
	})

registerCliCommands(program, getRuntimeContext)

program.parseAsync(process.argv).catch((err: unknown) => {
	console.error(err instanceof Error ? err.message : String(err))
	process.exit(1)
})
