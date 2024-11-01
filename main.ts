import { getUrlsFromSitemap } from "./lib/sitemap-parser.ts";
import {
  _getUrlStatus,
  submitUrlsToGoogleIndex,
} from "./lib/google-indexing.ts";
import credentials from "./service-account.json" with { type: "json" };

const sitemapUrls = [
  "https://example.org/sitemap.xml",
];

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  for (const sitemapUrl of sitemapUrls) {
    const urls = await getUrlsFromSitemap(sitemapUrl);
    console.log({ urls });

    const results = await submitUrlsToGoogleIndex(
      urls,
      "URL_UPDATED",
      credentials,
    );
    console.log({ results });

    // await new Promise(resolve => setTimeout(resolve, 3000))

    // const statusResults = await getUrlStatus(urls, credentials)
    // console.log({statusResults})
  }
}
