/**
 * Fetch and parse a sitemap file that lists collection pages.
 * @param url - the URL of the sitemap file that lists only collection pages.
 * @returns a list of collection page URLs.
 */
async function getCollectionURLsFromSitemap(
  sitemapURL: string,
): Promise<string[]> {
  const response = await fetch(sitemapURL)
  const sitemap = await response.text()
  return []
}

/**
 * Scrape products given a list of collection page URLs. This will capture all
 * the products in the view and then apply color and sizing filters to see which
 * filters apply to which products.
 * @param dir - the directory to save the scraped data to.
 * @param urls - the list of collection page URLs to scrape.
 */
