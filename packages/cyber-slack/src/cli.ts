#!/usr/bin/env node

import { program } from 'commander'
import { runMcpServer } from './mcp.js'

program.name('cyber-slack').description('Slack CLI and MCP server for AI agents').version('0.1.0')

program
	.command('mcp')
	.description('Start the MCP server')
	.action(async () => {
		await runMcpServer()
	})

program.parse()
