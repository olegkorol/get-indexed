import { getUrlsFromSitemap } from './lib/sitemap-parser.ts'
import { submitUrlsToGoogleIndex, getUrlStatus } from './lib/google-indexing.ts'
import credentials from './service-account.json' with { type: 'json' }

// const sitemapUrl = 'https://www.koiztech.com/sitemap.xml'

const sitemapUrl = 'https://www.ksuwik.com/sitemap.xml'

// const urls = [
//   'https://www.koiztech.com/products',
// ]

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const urls = await getUrlsFromSitemap(sitemapUrl)
  console.log({urls})

  const results = await submitUrlsToGoogleIndex(urls, 'URL_UPDATED', credentials)
  console.log({results})

  await new Promise(resolve => setTimeout(resolve, 5000))

  const statusResults = await getUrlStatus(urls, credentials)
  console.log({statusResults})
}
