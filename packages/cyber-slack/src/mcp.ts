import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createRuntimeContext, type RuntimeContext, registerMcpTools } from './composition.js'

let runtimeContext: RuntimeContext | undefined

function getRuntimeContext(): RuntimeContext {
	runtimeContext ??= createRuntimeContext()
	return runtimeContext
}

export async function runMcpServer(): Promise<void> {
	const server = new McpServer({
		name: 'cyber-slack',
		version: '0.1.0',
	})

	registerMcpTools(server, getRuntimeContext)

	const transport = new StdioServerTransport()
	await server.connect(transport)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runMcpServer().catch(console.error)
}
