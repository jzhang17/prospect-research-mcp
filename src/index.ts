import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { setupPrompts } from './prompts';
import { setupTools } from './tools';

async function main() {
  const server = new McpServer({
    name: "prospect-research-server",
    version: "0.1.0"
  });

  // Setup prompts and tools
  setupPrompts(server);
  setupTools(server);

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log('MCP Server started with stdio transport');
}

main().catch(console.error); 