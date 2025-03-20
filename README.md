
# Prospect Research MCP Server

[![smithery badge](https://smithery.ai/badge/@jzhang17/prospect-research-mcp)](https://smithery.ai/server/@jzhang17/prospect-research-mcp)

A Model Context Protocol (MCP) server implementation focused on prospect research tools, deployed on Smithery Web infrastructure.

## Setup

To set up the project locally:

```bash
npm install
```

## Deployment

This server is deployed to Smithery Web platform. To access the deployed server:

1. Visit [Smithery.ai](https://smithery.ai/server/@jzhang17/prospect-research-mcp)
2. The server is available at the URL provided by Smithery Web
3. Connect to the server using any MCP-compatible client (see MCP Integration section)

## Structure

- `/src/index.ts` - Main server entrypoint
- `/src/tools/` - MCP tool implementations (web search, webpage scraping, batch search)
- `/src/prompts/` - MCP prompt implementations
- `/src/types/` - TypeScript type definitions

## Development

To run the server locally during development:

```bash
npm run dev
```

## Tools

The server provides the following research tools:

- `web-search` - A semantic search engine (Tavily) that understands contextual meaning
- `scrape-webpages` - Scrape and process content from multiple web pages (up to 20 links)
- `batch-web-search` - Process multiple search queries in parallel using Google via Search1API

## Prompts

- `simple-assist` - A basic prompt for general queries
- `research` - A prompt for detailed research questions
- `review-code` - A prompt for code review

## MCP Integration

This server implements the Model Context Protocol (MCP), allowing AI assistants to access its tools and prompts:

### For Claude Desktop

1. Edit your `claude_desktop_config.json` file
2. Add the Smithery-hosted server URL:

```json
{
  "mcpServers": {
    "prospect-research": {
      "transport": "sse",
      "url": "https://smithery.ai/server/@jzhang17/prospect-research-mcp"
    }
  }
}
```

### For Other MCP Clients

Configure your client to connect to the server using the SSE transport type and the Smithery-hosted URL.

## Environment Variables

The server requires the following API keys:

- `TAVILY_API_KEY` - For web search functionality
- `JINA_API_KEY` - For webpage scraping
- `SEARCH1API_KEY` - For batch web search

These are configured in the Smithery Web environment.

## References

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Smithery AI Platform](https://smithery.ai)
- [MCP Client List](https://modelcontextprotocol.io/clients)