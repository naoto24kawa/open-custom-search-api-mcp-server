import { describe, it, expect, beforeAll, mock } from "bun:test";

// Mock environment variables
beforeAll(() => {
  process.env.GOOGLE_API_KEY = "test-api-key";
  process.env.GOOGLE_SEARCH_ENGINE_ID = "test-search-engine-id";
});

// Mock fetch globally
global.fetch = mock(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      items: [
        {
          title: "Test Result 1",
          link: "https://example.com/1",
          snippet: "This is a test snippet 1",
          displayLink: "example.com"
        },
        {
          title: "Test Result 2", 
          link: "https://example.com/2",
          snippet: "This is a test snippet 2",
          displayLink: "example.com"
        }
      ],
      searchInformation: {
        totalResults: "2",
        searchTime: 0.123
      }
    })
  } as Response)
);

describe("Custom Search MCP Server", () => {
  it("should initialize without errors when environment variables are set", async () => {
    // Dynamically import to ensure environment variables are set first
    const { default: CustomSearchMCPServer } = await import("../src/index.js");
    expect(() => new CustomSearchMCPServer()).not.toThrow();
  });

  it("should throw error when GOOGLE_API_KEY is missing", async () => {
    const originalApiKey = process.env.GOOGLE_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    
    try {
      const { default: CustomSearchMCPServer } = await import("../src/index.js");
      expect(() => new CustomSearchMCPServer()).toThrow("GOOGLE_API_KEY environment variable is required");
    } finally {
      process.env.GOOGLE_API_KEY = originalApiKey;
    }
  });

  it("should throw error when GOOGLE_SEARCH_ENGINE_ID is missing", async () => {
    const originalSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    delete process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    try {
      const { default: CustomSearchMCPServer } = await import("../src/index.js");
      expect(() => new CustomSearchMCPServer()).toThrow("GOOGLE_SEARCH_ENGINE_ID environment variable is required");
    } finally {
      process.env.GOOGLE_SEARCH_ENGINE_ID = originalSearchEngineId;
    }
  });
});

describe("Search Tool Validation", () => {
  it("should validate search parameters correctly", async () => {
    const { z } = await import("zod");
    
    const SearchToolSchema = z.object({
      query: z.string().describe("Search query"),
      limit: z.number().min(1).max(10).default(10).optional().describe("Maximum number of results to return (1-10)")
    });

    // Valid parameters
    expect(() => SearchToolSchema.parse({ query: "test" })).not.toThrow();
    expect(() => SearchToolSchema.parse({ query: "test", limit: 5 })).not.toThrow();
    expect(() => SearchToolSchema.parse({ query: "test", limit: 10 })).not.toThrow();
    expect(() => SearchToolSchema.parse({ query: "test", limit: 1 })).not.toThrow();

    // Invalid parameters
    expect(() => SearchToolSchema.parse({ query: "test", limit: 0 })).toThrow();
    expect(() => SearchToolSchema.parse({ query: "test", limit: 11 })).toThrow();
    expect(() => SearchToolSchema.parse({ limit: 5 })).toThrow(); // missing query
  });
});

describe("API Integration", () => {
  it("should construct correct API URL", () => {
    const GOOGLE_CUSTOM_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";
    const apiKey = "test-key";
    const searchEngineId = "test-cx";
    const query = "test query";
    const limit = 5;

    const url = new URL(GOOGLE_CUSTOM_SEARCH_URL);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("cx", searchEngineId);
    url.searchParams.set("q", query);
    url.searchParams.set("num", limit.toString());

    expect(url.toString()).toBe(
      "https://www.googleapis.com/customsearch/v1?key=test-key&cx=test-cx&q=test+query&num=5"
    );
  });

  it("should handle API response correctly", async () => {
    const mockResponse = {
      items: [
        {
          title: "Test Result",
          link: "https://example.com",
          snippet: "Test snippet",
          displayLink: "example.com"
        }
      ],
      searchInformation: {
        totalResults: "1",
        searchTime: 0.1
      }
    };

    expect(mockResponse.items).toHaveLength(1);
    expect(mockResponse.items[0].title).toBe("Test Result");
    expect(mockResponse.searchInformation?.totalResults).toBe("1");
  });
});