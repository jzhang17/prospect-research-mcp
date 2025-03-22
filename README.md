
# Prospect Research MCP Server

[![smithery badge](https://smithery.ai/badge/@jzhang17/prospect-research-mcp)](https://smithery.ai/server/@jzhang17/prospect-research-mcp)

A Model Context Protocol (MCP) server implementation focused on prospect research tools, deployed on Smithery Web infrastructure.

## Features

- **Semantic Search**: Contextual search that understands meaning and intent behind queries
- **Webpage Scraping**: Extract and process content from multiple web pages
- **Batch Search Processing**: Execute multiple search queries in parallel
- **Comprehensive Coverage**: Combine different search approaches for thorough research

## Tools

- **web-search**
  - A semantic search engine (Tavily) that understands the contextual meaning and intent behind queries
  - Inputs:
    - `query` (string): The search query to look up

- **scrape-webpages**
  - Scrape the provided web pages for detailed information
  - Inputs:
    - `links` (array): A list of URLs to scrape (optimally less than 10)
  - Processes content to remove images and returns combined content from provided URLs

- **batch-web-search**
  - Traditional keyword-based search (Google via Search1API) that processes multiple queries simultaneously
  - Inputs:
    - `queries` (array): List of search queries to process in parallel (optimally less than 30)
  - Executes multiple distinct search queries in parallel

## Prompts

- `simple-assist` - A basic prompt for general queries
- `research` - A prompt for detailed research questions
- `review-code` - A prompt for code review

## Configuration

### Required API Keys
This server requires the following API keys:
- `TAVILY_API_KEY` - For semantic web search functionality
- `JINA_API_KEY` - For webpage scraping
- `SEARCH1API_KEY` - For batch web search

These are configured in the Smithery Web environment for the deployed version.

### Usage with Claude Desktop
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prospect-research": {
      "transport": "sse",
      "url": "https://smithery.ai/server/@jzhang17/prospect-research-mcp",
      "env": {
        "TAVILY_API_KEY": "YOUR_TAVILY_API_KEY",
        "JINA_API_KEY": "YOUR_JINA_API_KEY",
        "SEARCH1API_KEY": "YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

### For Other MCP Clients
Configure your client to connect to the server using the SSE transport type and the Smithery-hosted URL.


## Structure

- `/src/index.ts` - Main server entrypoint
- `/src/tools/` - MCP tool implementations (web search, webpage scraping, batch search)
- `/src/prompts/` - MCP prompt implementations
- `/src/types/` - TypeScript type definitions

## Deployment

This server is deployed to Smithery Web platform. To access the deployed server:

1. Visit [Smithery.ai](https://smithery.ai/server/@jzhang17/prospect-research-mcp)
2. The server is available at the URL provided by Smithery Web

## References

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Smithery AI Platform](https://smithery.ai)
- [MCP Client List](https://modelcontextprotocol.io/clients)
