// Aritzia has a ton of sub-brands that are all owned by Aritizia LP. My db
// schema is set up to handle this well. To get products on Aritzia, simply:
// await prisma.product.findMany({
//   include: { images: true },
//   where: {
//     brands: { some: { company: { name: { equals: 'Aritzia' } } } },
//     prices: { some: { brand: { name: { equals: 'Aritzia' } } } },
//   },
// })

// The scraping plan:
// 1. Manually construct list of product parent Styles (links in the header).
// 2. For each product parent Style, open a new window in parallel.
// 3. Each one of those product parent Styles has a list of children Styles at
//    the top of the page. Some product pages have additional style-specific
//    attributes (e.g. "neckline") that will be added as a StyleGroup.
// 4. Record all the products that appear in the product parent Style page.
// 5. Apply each possible filter sequentially to the child Style list. Record
//    which products appear in which filters.
// 6. For each product, open the product window in parallel to record:
//    - colors
//    - sizes
//    - prices
//    - description
//    - images
//    - materials
//    - reviews

import { Cluster } from 'puppeteer-cluster'
import type { Page } from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { pino } from 'pino'
import puppeteer from 'puppeteer-extra'

puppeteer.use(StealthPlugin())

const log = pino({ level: process.env.LOG_LEVEL ?? 'debug' })

// 1. Manually construct list of product parent Styles (links in the header).
const links = {
  tops: 'https://www.aritzia.com/us/en/clothing/tshirts',
  sweaters: 'https://www.aritzia.com/us/en/clothing/sweaters',
  blouses: 'https://www.aritzia.com/us/en/clothing/blouses',
  bodysuits: 'https://www.aritzia.com/us/en/clothing/bodysuits',
  sweatsuits: 'https://www.aritzia.com/us/en/clothing/sweatsuit-sets',
  coats: 'https://www.aritzia.com/us/en/clothing/coats-jackets',
  dresses: 'https://www.aritzia.com/us/en/clothing/dresses',
  pants: 'https://www.aritzia.com/us/en/clothing/pants',
  denim: 'https://www.aritzia.com/us/en/clothing/jeans',
  leggings: 'https://www.aritzia.com/us/en/clothing/leggings-and-bike-shorts',
  skirts: 'https://www.aritzia.com/us/en/clothing/skirts',
  shorts: 'https://www.aritzia.com/us/en/clothing/shorts',
  jumpsuits: 'https://www.aritzia.com/us/en/clothing/jumpsuits-rompers',
  accessories: 'https://www.aritzia.com/us/en/clothing/accessories',
  swimsuits: 'https://www.aritzia.com/us/en/clothing/swimsuits',
  shoes: 'https://www.aritzia.com/us/en/clothing/shoes',
  knitwear: 'https://www.aritzia.com/us/en/clothing/knitwear',
  contour: 'https://www.aritzia.com/us/en/clothing/contour-clothing',
  suits: 'https://www.aritzia.com/us/en/clothing/suits-for-women',
  linen: 'https://www.aritzia.com/us/en/clothing/linen-clothing',
  cargo: 'https://www.aritzia.com/us/en/clothing/cargo-pants',
}

async function loadPage(
  page: Page,
  url = 'https://www.isabelmarant.com/nz/isabel-marant/men/im-all-man',
) {
  log.debug('Loading page... %s', url)
  page.on('console', (msg) => log.trace(msg.text()))
  await page.goto(url, { waitUntil: 'networkidle0' })
  log.debug('Loaded page: %s', url)
}

export async function scrape() {
  const cluster = await Cluster.launch({
    puppeteer,
    puppeteerOptions: {
      headless: false,
      executablePath: '/opt/homebrew/bin/chromium',
    },
    maxConcurrency: 100,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    timeout: 10e5,
  })

  type Style = { url: string; name: string }

  // 2. For each product parent Style, open a new window in parallel.
  async function concurrent({
    page,
    data,
  }: {
    page: Page
    data: Style
  }): Promise<void> {
    await loadPage(page, data.url)
    // 3. Each one of those product parent Styles has a list of children Styles at
    //    the top of the page. Some product pages have additional style-specific
    //    attributes (e.g. "neckline") that will be added as a StyleGroup.
    const childStyles = page.$$eval('.ar-swiper-item a', (childStyleLinks) =>
      childStyleLinks.map((link) => ({
        url: link.href,
        name: link.textContent,
      })),
    )
    log.debug('child styles: %o', childStyles)
  }

  await cluster.queue({ url: links.tops, name: 'tops' }, concurrent)

  await cluster.idle()
  await cluster.close()
}
