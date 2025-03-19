import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const setupPrompts = (server: McpServer): void => {
  server.prompt(
    "simple-assist",
    { 
      query: z.string() 
    },
    ({ query }: { query: string }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are a helpful assistant.

User query: ${query}

Please provide a helpful response.`
        }
      }]
    })
  );

  server.prompt(
    "research",
    { 
      query: z.string(),
      context: z.string().optional()
    },
    ({ query, context = "" }: { query: string; context?: string }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are a research assistant specializing in providing detailed information.

User query: ${query}

Additional context: ${context}

Provide a comprehensive research-based response.`
        }
      }]
    })
  );

  server.prompt(
    "review-code",
    { 
      code: z.string() 
    },
    ({ code }: { code: string }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please review this code:\n\n${code}`
        }
      }]
    })
  );
}; 