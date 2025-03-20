import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const setupTools = (server: McpServer): void => {
  server.tool(
    "web-search",
    {
      query: z.string()
    },
    async ({ query }: { query: string }) => {
      try {
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: TAVILY_API_KEY not found in environment variables"
            }]
          };
        }

        const response = await axios.post(
          'https://api.tavily.com/search',
          {
            query,
            search_depth: "advanced",
            include_answer: true,
            max_results: 10
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tavilyApiKey}`
            }
          }
        );

        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error performing web search: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );

  server.tool(
    "scrape-webpages",
    {
      links: z.array(z.string())
    },
    async ({ links }: { links: string[] }) => {
      try {
        // Basic check: do we have any links?
        if (!links || links.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: No URLs provided."
            }]
          };
        }

        const jinaApiKey = process.env.JINA_API_KEY;
        if (!jinaApiKey) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: JINA_API_KEY not found in environment variables."
            }]
          };
        }

        // Function to remove images from markdown content
        const removeImages = (content: string): string => {
          const pattern = /!\[([^\]]*)\]\(([^\)]+)\)/g;
          return content.replace(pattern, '');
        };

        // Scrape each URL
        const scrapeTasks = links.map(async (link) => {
          try {
            const fullUrl = `https://r.jina.ai/${link}`;
            const response = await axios.get(fullUrl, {
              headers: {
                'Authorization': `Bearer ${jinaApiKey}`
              }
            });
            
            // Process the content
            let content = response.data;
            if (typeof content === 'string') {
              // Replace dollar signs to avoid escaping issues
              content = content.replace(/\$/g, '\\$');
              // Remove images
              content = removeImages(content);
              return content;
            }
            return JSON.stringify(content);
          } catch (error) {
            return `Error scraping ${link}: ${error instanceof Error ? error.message : String(error)}`;
          }
        });

        // Wait for all scraping to complete
        const results = await Promise.all(scrapeTasks);
        let finalContent = results.join('\n\n');

        // Truncate if too long
        if (finalContent.length > 200000) {
          finalContent = finalContent.substring(0, 200000) + '\n\n[Content truncated due to length...]';
        }

        return {
          content: [{ 
            type: "text", 
            text: finalContent
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error scraping webpages: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );

  server.tool(
    "batch-web-search",
    {
      queries: z.array(z.string())
    },
    async ({ queries }: { queries: string[] }) => {
      try {
        const apiKey = process.env.SEARCH1API_KEY;
        if (!apiKey) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: SEARCH1API_KEY not found in environment variables"
            }]
          };
        }

        const batchRequest = queries.map(query => ({
          query,
          search_service: "google",
          max_results: 10,
          gl: "us",
          hl: "en"
        }));

        const response = await axios.post(
          'https://api.search1api.com/search',
          batchRequest,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );

        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error performing batch web search: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );
}; 