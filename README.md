# MCP Server

[![smithery badge](https://smithery.ai/badge/@jzhang17/prospect-research-mcp)](https://smithery.ai/server/@jzhang17/prospect-research-mcp)

A simple implementation of the Model Context Protocol (MCP) server with basic prompts and tools.

## Setup

```bash
npm install
```

## Structure

- `/src/index.ts` - Main server entrypoint
- `/src/prompts/` - MCP prompt implementations
- `/src/tools/` - MCP tool implementations
- `/src/types/` - TypeScript type definitions

## Running

```bash
npm run dev
```

## Prompts

- `simple-assist` - A basic prompt for general queries
- `research` - A prompt for detailed research questions
- `review-code` - A prompt for code review

## Tools

- `calculate-bmi` - Calculate BMI from weight and height
- `fetch-weather` - Get weather information for a city (mock)
- `search-information` - Search for information on a topic (mock)

## References

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) 