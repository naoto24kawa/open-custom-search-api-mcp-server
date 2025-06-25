#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const GOOGLE_CUSTOM_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

interface CustomSearchResponse {
  items?: SearchResult[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
}

const SearchToolSchema = z.object({
  query: z.string().describe("Search query"),
  limit: z.number().min(1).max(10).default(10).optional().describe("Maximum number of results to return (1-10)")
});

class CustomSearchMCPServer {
  private server: Server;
  private apiKey: string;
  private searchEngineId: string;

  constructor() {
    this.server = new Server(
      {
        name: "custom-search-api-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiKey = process.env.GOOGLE_API_KEY || "";
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || "";

    if (!this.apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }
    if (!this.searchEngineId) {
      throw new Error("GOOGLE_SEARCH_ENGINE_ID environment variable is required");
    }

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "google_search",
            description: "Search the web using Google Custom Search API",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query"
                },
                limit: {
                  type: "number",
                  description: "Maximum number of results to return (1-10)",
                  minimum: 1,
                  maximum: 10,
                  default: 10
                }
              },
              required: ["query"]
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== "google_search") {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      const args = SearchToolSchema.parse(request.params.arguments);
      
      try {
        const results = await this.performSearch(args.query, args.limit || 10);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                query: args.query,
                totalResults: results.searchInformation?.totalResults || "0",
                searchTime: results.searchInformation?.searchTime || 0,
                results: results.items || []
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
          content: [
            {
              type: "text",
              text: `Error performing search: ${errorMessage}`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async performSearch(query: string, limit: number): Promise<CustomSearchResponse> {
    const url = new URL(GOOGLE_CUSTOM_SEARCH_URL);
    url.searchParams.set("key", this.apiKey);
    url.searchParams.set("cx", this.searchEngineId);
    url.searchParams.set("q", query);
    url.searchParams.set("num", limit.toString());

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Custom Search API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<CustomSearchResponse>;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Only run the server if this file is executed directly
if (import.meta.main) {
  const server = new CustomSearchMCPServer();
  server.run().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}

export default CustomSearchMCPServer;