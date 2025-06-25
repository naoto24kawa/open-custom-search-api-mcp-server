# Open Custom Search API MCP Server

[![license](https://img.shields.io/npm/l/open-custom-search-api-mcp-server)](https://github.com/naoto24kawa/open-custom-search-api-mcp-server/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/open-custom-search-api-mcp-server)](https://www.npmjs.com/package/open-custom-search-api-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/open-custom-search-api-mcp-server)](https://www.npmjs.com/package/open-custom-search-api-mcp-server)
[![GitHub stars](https://img.shields.io/github/stars/naoto24kawa/open-custom-search-api-mcp-server)](https://github.com/naoto24kawa/open-custom-search-api-mcp-server)

A Model Context Protocol (MCP) server that provides access to Google's Custom Search API.

## Features

- **google_search**: Search the web using Google Custom Search API
- Configurable result limits (1-10 results)
- Environment variable configuration for API credentials
- Comprehensive error handling

## Installation

### Using npx (Recommended)

```bash
# Run directly without installation
npx open-custom-search-api-mcp-server
```

### Local Installation

```bash
npm install -g open-custom-search-api-mcp-server
```

## Prerequisites

1. Google API Key - Get one from [Google Cloud Console](https://console.cloud.google.com/)
2. Custom Search Engine ID - Create one at [Google Custom Search](https://cse.google.com/)

## Usage

### Running with npx

```bash
npx open-custom-search-api-mcp-server
```

### Running locally

```bash
# After global installation
open-custom-search-api-mcp-server
```

### Available Tools

#### google_search

Searches the web using Google Custom Search API.

**Parameters:**
- `query` (required): The search query
- `limit` (optional): Maximum number of results to return (1-10, default: 10)

**Example:**
```json
{
  "name": "google_search",
  "arguments": {
    "query": "MCP server development",
    "limit": 5
  }
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

## Configuration

### MCP Client Configuration

To use this server with Claude Desktop or other MCP clients, add the following configuration to your MCP client settings (e.g., `.mcp.json` or Claude Desktop configuration):

```json
{
  "mcpServers": {
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

For local development or global installation:

```json
{
  "mcpServers": {
    "custom-search": {
      "command": "open-custom-search-api-mcp-server",
      "env": {
        "GOOGLE_API_KEY": "your-google-api-key",
        "GOOGLE_SEARCH_ENGINE_ID": "your-custom-search-engine-id"
      }
    }
  }
}
```

### Environment Variables

The server requires the following environment variables:

- `GOOGLE_API_KEY`: Your Google API key from Google Cloud Console
- `GOOGLE_SEARCH_ENGINE_ID`: Your Custom Search Engine ID from Google Custom Search

## Architecture

All search operations are performed locally on the MCP server to minimize AI token consumption. The server handles:

- HTTP/HTTPS requests to Google Custom Search API
- JSON response parsing and formatting
- Error handling for API failures
- Environment variable validation
- Input parameter validation

## License

MIT