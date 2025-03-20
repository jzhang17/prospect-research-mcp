import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';

export const setupTools = (server: McpServer): void => {
  server.tool(
    "web-search",
    "A semantic search engine (Tavily) that understands the contextual meaning and intent behind queries.\n\nThis tool excels at:\n- Understanding complex or ambiguous queries\n- Interpreting natural language questions\n- Finding relevant content even when exact keywords aren't present\n- Comprehending relationships between concepts\n\nUse this as your primary search tool for research questions, conceptual understanding, and when seeking comprehensive results.",
    {
      query: z.string().describe("The search query to look up")
    },
    async ({ query }: { query: string }) => {
      try {
        const tavilyApiKey = process.env.TAVILY_API_KEY;
        if (!tavilyApiKey) {
          return {
            content: [{
              type: "text",
              text: "Error: TAVILY_API_KEY not found in environment variables"
            }],
            isError: true
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
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "scrape-webpages",
    "Scrape the provided web pages for detailed information.\n\nUse with less than 20 links (most optimally less than 10).\n\nThis tool fetches the content of multiple web pages, processes them to remove images, and returns their combined content. It's useful for obtaining detailed information from specific web pages that you already have links to.",
    {
      links: z.array(z.string()).describe("A list of URLs to scrape (optimally less than 10)")
    },
    async ({ links }: { links: string[] }) => {
      try {
        // 1. Basic check: do we have any links?
        if (!links || links.length === 0) {
          return {
            content: [{
              type: "text",
              text: "Error: No URLs provided."
            }],
            isError: true
          };
        }

        // 2. Check for the JINA_API_KEY in environment
        const jinaApiKey = process.env.JINA_API_KEY;
        if (!jinaApiKey) {
          return {
            content: [{
              type: "text",
              text: "Error: JINA_API_KEY not found in environment variables."
            }],
            isError: true
          };
        }

        // Function to remove markdown images
        const removeImages = (content: string): string => {
          const pattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
          return content.replace(pattern, '');
        };

        // 3. Process each URL and collect results
        const scrapeResults = await Promise.all(links.map(async (link) => {
          try {
            // Build the proxied Jina URL
            const fullUrl = `https://r.jina.ai/${link}`;
            
            const response = await axios.get(fullUrl, {
              headers: { "Authorization": `Bearer ${jinaApiKey}` }
            });
            
            // Replace dollar signs to avoid escaping issues
            let content = response.data.replace(/\$/g, "\\$");
            
            // Remove images
            return removeImages(content);
          } catch (error) {
            return `Error scraping ${link}: ${error instanceof Error ? error.message : String(error)}`;
          }
        }));

        // 4. Combine the content into one large string
        let finalContent = scrapeResults.join("\n\n");

        // 5. Truncate if it's too long
        if (finalContent.length > 200_000) {
          finalContent = finalContent.substring(0, 200_000) + "\n\n[Content truncated due to length...]";
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
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "batch-web-search",
    "Traditional keyword-based search (Google via Search1API) that processes multiple queries simultaneously.\n\nThis tool excels at:\n- Finding exact keyword matches across multiple queries\n- Syntactic/lexical matching rather than semantic understanding\n- Processing multiple different search queries in parallel\n- Finding specific terms or direct information\n\nUse this tool when you need to search for multiple distinct pieces of information simultaneously or when exact keyword matching is more important than contextual understanding.\n\nUse with less than 50 queries (most optimally less than 30).",
    {
      queries: z.array(z.string()).describe("List of search queries to process in parallel (optimally less than 30)")
    },
    async ({ queries }: { queries: string[] }) => {
      try {
        const apiKey = process.env.SEARCH1API_KEY;
        if (!apiKey) {
          return {
            content: [{
              type: "text",
              text: "Error: SEARCH1API_KEY not found in environment variables"
            }],
            isError: true
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
          "https://api.search1api.com/search",
          batchRequest,
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
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
          }],
          isError: true
        };
      }
    }
  );
};