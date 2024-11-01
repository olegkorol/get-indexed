# Get Indexed

A Deno-based tool for submitting URLs to Google's Indexing API and checking their indexing status.

## Features

- Parse XML sitemaps (including sitemap index files) to extract URLs
- Submit URLs to Google's Indexing API for indexing/updating
- Check indexing status of submitted URLs
- Support for both single sitemaps and sitemap index files

## Prerequisites

- [Deno](https://deno.land/) installed
- Google Search Console API access
- Service account credentials with Indexing API permissions

## Setup

1. Create a service account in Google Cloud Console
2. The Indexing API is enabled by default – no need to attach any policies to the service account
3. Download the service account credentials JSON file
4. Place the credentials file as `service-account.json` in the project root
5. Head over to the Google Search Console and add the email of the service account as a user (with "Owner" access)

## Usage

1. Update the `sitemapUrls` array in `main.ts` with your sitemap URL(s):

```typescript
// main.ts

const sitemapUrls = [
  'https://example.org/sitemap.xml',
]

// Sitemap index files are supported as well:

const sitemapUrls = [
  'https://example.org/sitemap-index.xml',
]
```

2. Run the script:

```bash
deno run start
```

## To-do

- Add support for more Search Engines
