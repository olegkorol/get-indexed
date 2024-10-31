/**
 * Fetches and parses URLs from a sitemap
 * Supports both regular sitemaps and sitemap index files
 * @param sitemapUrl URL of the sitemap
 * @returns Array of URLs found in the sitemap
 */
export async function getUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl)
    const text = await response.text()

    // Check if it's a sitemap index file
    if (text.includes('<sitemapindex')) {
      const sitemapUrls = [...text.matchAll(/<loc>(.+?)<\/loc>/g)]
        .map(match => match[1])
        .filter(Boolean)

      // Recursively fetch URLs from each sitemap in the index
      const nestedResults = await Promise.all(
        sitemapUrls.map(url => getUrlsFromSitemap(url))
      )
      
      return nestedResults.flat()
    }

    // Regular sitemap - extract URLs
    const matches = [...text.matchAll(/<loc>(.+?)<\/loc>/g)]
    return matches.map(match => match[1]).filter(Boolean)
  } catch (error) {
    console.error(`Error fetching sitemap ${sitemapUrl}:`, error)
    return []
  }
}