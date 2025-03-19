import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export const setupTools = (server: McpServer): void => {
  server.tool(
    "calculate-bmi",
    {
      weightKg: z.number(),
      heightM: z.number()
    },
    async ({ weightKg, heightM }: { weightKg: number; heightM: number }) => ({
      content: [{
        type: "text",
        text: String(weightKg / (heightM * heightM))
      }]
    })
  );

  server.tool(
    "fetch-weather",
    { 
      city: z.string() 
    },
    async ({ city }: { city: string }) => {
      // Mock implementation - would be a real API call in production
      const weatherData = {
        temperature: 72,
        conditions: "Sunny",
        humidity: "45%",
        location: city
      };
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(weatherData, null, 2)
        }]
      };
    }
  );

  server.tool(
    "search-information",
    {
      query: z.string()
    },
    async ({ query }: { query: string }) => {
      // Mock implementation - would be a real search API in production
      const results = [
        { title: `Result 1 for "${query}"`, url: "https://example.com/1" },
        { title: `Result 2 for "${query}"`, url: "https://example.com/2" }
      ];
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(results, null, 2)
        }]
      };
    }
  );
}; 