# Google Custom Search API MCP Server

This is a Model Context Protocol (MCP) server that provides access to Google's Custom Search API.

## Features

- Search the web using Google Custom Search API
- Configurable result limits (1-10 results)
- Environment variable configuration for API credentials

## Prerequisites

1. Google API Key - Get one from [Google Cloud Console](https://console.cloud.google.com/)
2. Custom Search Engine ID - Create one at [Google Custom Search](https://cse.google.com/)

## Configuration

### MCP Settings

Add this server to your MCP configuration file (`.mcp.json`):

```json
{
  "servers": {
    "custom-search": {
      "command": "npx",
      "args": ["open-custom-search-api-mcp-server"],
      "env": {
        "GOOGLE_API_KEY": "your-google-api-key",
        "GOOGLE_SEARCH_ENGINE_ID": "your-custom-search-engine-id"
      }
    }
  }
}
```

An example configuration file (`example.mcp.json`) is included in the package for reference.

## MCP Tool

The server provides a single tool:

### `google_search`

Searches the web using Google Custom Search API.

**Parameters:**
- `query` (string, required): The search query
- `limit` (number, optional): Maximum number of results to return (1-10, default: 10)

**Example:**
```json
{
  "query": "MCP server development",
  "limit": 5
}
```

**Response:**
```json
{
  "query": "MCP server development",
  "totalResults": "1000000",
  "searchTime": 0.123,
  "results": [
    {
      "title": "Example Result",
      "link": "https://example.com",
      "snippet": "This is an example search result...",
      "displayLink": "example.com"
    }
  ]
}
```

## License

MIT