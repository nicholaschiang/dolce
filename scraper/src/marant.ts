import fs from 'fs/promises'

import {
  Level,
  Market,
  PrismaClient,
  SeasonName,
  Sex,
  Tier,
} from '@prisma/client'
import { Cluster } from 'puppeteer-cluster'
import type { Page } from 'puppeteer'
import type { Prisma } from '@prisma/client'
import ProgressBar from 'progress'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { dequal } from 'dequal/lite'
import { pino } from 'pino'
import puppeteer from 'puppeteer-extra'

puppeteer.use(StealthPlugin())

const DEBUGGING = false
const log = pino({ level: 'debug' })
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

async function loadPage(
  page: Page,
  url = 'https://www.isabelmarant.com/nz/isabel-marant/men/im-all-man',
) {
  log.debug('Loading page... %s', url)
  page.on('console', (msg) => log.trace(msg.text()))
  await page.goto(url, { waitUntil: 'networkidle0' })
  log.debug('Loaded page: %s', url)
}

async function resetFilters(page: Page) {
  log.debug('Resetting filters...')
  const filterButtonSel = 'button.resetFilters'
  await page.waitForSelector(filterButtonSel)
  await page.click(filterButtonSel)
  await page.waitForNetworkIdle()
  log.debug('Reset filters.')
}

async function openFiltersPanel(page: Page) {
  log.debug('Opening filters panel...')
  const filterButtonSel = 'button.filtersPanelTrigger'
  await page.waitForSelector(filterButtonSel)
  await page.click(filterButtonSel)
  await page.waitForSelector(
    'div.filtersPanelWrapper.open:not(.velocity-animating) > div.filtersPanel',
  )
  log.debug('Opened filters panel.')
}

type Filter = {
  title: string
  name?: string
  url?: string
  groupIdx: number
  idx: number
}

function getSeason(f: Required<Filter>): Prisma.SeasonCreateInput | undefined {
  if (f.title.toLowerCase() !== 'season') {
    log.error('Not a season filter, skipping... %o', f)
    return undefined
  }
  switch (f.name.toLowerCase()) {
    case 'fall-winter 22':
      return { name: SeasonName.FALL_WINTER, year: 2022 }
    case 'spring-summer 23':
      return { name: SeasonName.SPRING_SUMMER, year: 2023 }
    default:
      log.error('Unknown season, skipping... %o', f)
      return undefined
  }
}

function filtersAreEqual(f1: Filter, f2: Filter) {
  return f1.title === f2.title && f1.name === f2.name
}

function filtersToStr(filters: Filter[]) {
  return filters.map((f) => `(${f.title}: ${f.name})`).join(' ')
}

const filterGroupsSel = 'ul.filterGroups:nth-of-type(2) > li.filterGroup'

async function getFilters(page: Page, title = 'Category'): Promise<Filter[]> {
  log.debug('Getting filters... (%s)', title)
  const filters = await page.evaluate(
    (sel, desiredFilterGroupTitle) => {
      const filterGroupEls = document.querySelectorAll(sel)
      return Array.from(filterGroupEls)
        .map((filterGroupEl, groupIdx) => {
          const filterGroupTitle = filterGroupEl
            .querySelector('div.title')
            ?.textContent?.trim()
          if (filterGroupTitle !== desiredFilterGroupTitle) return []
          const filterEls = filterGroupEl.querySelectorAll('.refinements > li')
          return Array.from(filterEls).map((filterEl, idx) => ({
            name: filterEl.querySelector('a > span.text')?.textContent?.trim(),
            url: filterEl.querySelector('a')?.href,
            title: filterGroupTitle,
            disabled: filterEl.className.includes('disabled'),
            groupIdx,
            idx,
          }))
        })
        .flat()
        .filter((filter) => filter.name && !filter.disabled)
    },
    filterGroupsSel,
    title,
  )
  log.debug('Got %d filters. (%s)', filters.length, title)
  return filters
}

async function clickFilter(page: Page, filter: Filter) {
  log.debug('Clicking filter... (%s: %s)', filter.title, filter.name)
  const filterSel =
    `${filterGroupsSel}:nth-child(${filter.groupIdx + 1}) ` +
    `ul.refinements > li`
  const filterIdxSel = `${filterSel}:nth-child(${filter.idx + 1})`
  log.debug('Filter (%s) selector: %s', filter.name, filterIdxSel)
  await page.waitForSelector(filterIdxSel)
  await page.$eval(`${filterIdxSel} > a span`, (el) => el.click())
  // I can't include the :nth-child() as the available filters change once a
  // filter is selected (e.g. other "Seasons" disappear after selecting one).
  await page.waitForNetworkIdle()
  await page.waitForSelector(`${filterSel}.selected`)
  log.debug('Clicked filter. (%s: %s)', filter.title, filter.name)
}

type Price = { value?: number; currency?: string }
type ProductMetadata = {
  product_position: number
  product_cod10: string
  product_title: string
  product_brand: string
  product_category: string
  product_macro_category: string
  product_micro_category: string
  product_macro_category_id: string
  product_micro_category_id: string
  product_color: string
  product_color_id: string
  product_price: number
  product_discountedPrice: number
  product_price_tf: number
  product_discountedPrice_tf: number
  product_quantity: number
  product_coupon: string
  product_is_in_stock: boolean
  list: string
}
type Product = {
  name?: string
  fullPrice?: Price
  salePrice?: Price
  url?: string
  imageUrl?: string
  metadata?: ProductMetadata
}

async function getProducts(page: Page): Promise<Product[]> {
  log.debug('Getting products...')
  const products = await page.evaluate(() => {
    function getPrice(el: Element): Price {
      const value = el.querySelector('.value')?.textContent?.replace(/,/g, '')
      const currency = el.querySelector('.currency')?.textContent?.trim()
      return { value: value ? Number(value) : undefined, currency }
    }
    const productEls = document.querySelectorAll('ul.products > li')
    return Array.from(productEls).map((productEl) => {
      const fullPriceEl = productEl.querySelector('.price:not(.discounted)')
      const salePriceEl = productEl.querySelector('.price.discounted')
      const fullPrice = fullPriceEl ? getPrice(fullPriceEl) : undefined
      const salePrice = salePriceEl ? getPrice(salePriceEl) : undefined
      const metadataEl = productEl.querySelector(
        'div.product-item[data-ytos-track-product-data]',
      )
      const metadata = metadataEl
        ? (JSON.parse(
            metadataEl.getAttribute('data-ytos-track-product-data') as string,
          ) as ProductMetadata)
        : undefined
      return {
        name: productEl
          .querySelector('[itemprop="title"]')
          ?.textContent?.trim(),
        url: productEl.querySelector('a')?.href,
        imageUrl: productEl.querySelector('img')?.src,
        metadata,
        fullPrice,
        salePrice,
      }
    })
  })
  log.debug('Got %d products.', products.length)
  return products
}

/**
 * Scrape products and the filters that apply to each from the Isabel Marant
 * e-commerce website. Saves the results to a JSON file.
 * @param dir - the directory to save the resulting `data.json` files.
 */
export async function scrape(dir = 'data/marant') {
  type TaskData = { existingFilters: Filter[]; filtersToGet: string[] }

  // For every category:
  // 1. open this page;
  // 2. open the filters panel;
  // 3. click the category filter;
  // 4. for every color:
  //    1. open the page;
  //    2. open the filters panel;
  //    3. click the color filter;
  //    4. for every size:
  //       1. open the page;
  //       2. open the filters panel;
  //       3. click the size filter;
  //       4. for every season:
  //          1. open the page;
  //          2. open the filters panel;
  //          3. click the season filter;
  //          4. get the products shown (which will have the corresponding category, color, size, and season).

  const products: Product[] = []
  const filters: (Filter & { product_cod10: string })[] = []

  async function task({
    page,
    data: { filtersToGet, existingFilters },
  }: {
    page: Page
    data: TaskData
  }): Promise<TaskData[]> {
    // 1. Clear filters and apply the existing filters (in the correct order).
    log.info('Applying existing filters... %s', filtersToStr(existingFilters))
    await resetFilters(page)
    /* eslint-disable-next-line no-restricted-syntax */
    for await (const filter of existingFilters) await clickFilter(page, filter)

    // 2. Extract the products that have the current filters.
    // TODO: click the "LOAD MORE" button if necessary.
    log.info('Extracting products... %s', filtersToStr(existingFilters))
    const filteredProducts = await getProducts(page)
    filteredProducts.forEach((product) => {
      const existingProduct = products.find(
        (p) => p.metadata?.product_cod10 === product.metadata?.product_cod10,
      )
      if (!existingProduct) {
        // Add the product if it doesn't exist yet.
        log.trace('Adding new product: %o', product)
        products.push(product)
      } else {
        // Otherwise, add the current filters to the existing product.
        log.trace(
          'Found existing product (%s) for (%s).',
          existingProduct.name,
          product.name,
        )
        // The product position will change depending on the filters applied but
        // all other product metadata should remain the same. If not, warn.
        const meta1 = { ...existingProduct.metadata, product_position: 0 }
        const meta2 = { ...product.metadata, product_position: 0 }
        if (!dequal(meta1, meta2))
          log.warn('Metadata does not match: %o \n %o', meta1, meta2)
        // We can't store filters on the products list due to weird race
        // conditions with concurrent tasks (that I've yet to be able to debug).
        filters.push(
          ...existingFilters.map((existingFilter) => ({
            ...existingFilter,
            product_cod10: product.metadata?.product_cod10 as string,
          })),
        )
      }
    })
    await fs.writeFile(
      `${dir}/products.json`,
      JSON.stringify(products, null, 2),
    )
    await fs.writeFile(`${dir}/filters.json`, JSON.stringify(filters, null, 2))

    // If debugging is enabled, take a screenshot of the filtered page.
    if (DEBUGGING) {
      const filename =
        existingFilters
          .map((s) => `${s.title}-${s.name ?? 'unknown'}`)
          .join('-')
          .replace(/\s+/g, '-')
          .toLowerCase() || 'all'
      await page.screenshot({ path: `ss/${filename}.png`, fullPage: true })
      await fs.writeFile(
        `ss/${filename}-products.json`,
        JSON.stringify(filteredProducts, null, 2),
      )
      await fs.writeFile(
        `ss/${filename}-filters.json`,
        JSON.stringify(existingFilters, null, 2),
      )
    }

    // 3. If necessary, move on to filtering by the next filter in the list.
    if (filtersToGet.length > 0) {
      const filtersToSearchNext = await getFilters(page, filtersToGet[0])
      log.info(
        'Found %d %s filters for %s: %s',
        filtersToSearchNext.length,
        filtersToGet[0],
        filtersToStr(existingFilters),
        filtersToSearchNext.map((f) => f.name).join(', '),
      )

      return filtersToSearchNext.map((filterToSearchNext) => ({
        filtersToGet: filtersToGet.slice(1),
        existingFilters: [...existingFilters, filterToSearchNext],
      }))
    }
    return []
  }

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

  cluster.on('taskerror', (err, data: TaskData, willRetry) => {
    if (willRetry) {
      log.warn(
        'Error while crawling; retrying... %s \n %s \n %o',
        filtersToStr(data.existingFilters),
        (err as Error).stack,
        data,
      )
    } else {
      log.error(
        'Failed to crawl. %s \n %s \n %o',
        filtersToStr(data.existingFilters),
        (err as Error).stack,
        data,
      )
    }
  })

  async function recursive({
    page,
    data,
  }: {
    page: Page
    data: TaskData
  }): Promise<void> {
    /* eslint-disable-next-line no-restricted-syntax */
    for await (const taskData of await task({ page, data })) {
      await recursive({ page, data: taskData })
    }
  }

  async function concurrent({
    page,
    data,
  }: {
    page: Page
    data: TaskData
  }): Promise<void> {
    await loadPage(page)
    await openFiltersPanel(page)
    ;(await task({ page, data })).forEach((taskData) => {
      void cluster.queue(taskData)
    })
  }

  // Start concurrent pages for each category, and then reuse those pages with
  // the recursive task for every other filter to improve performance.
  await cluster.task(async ({ page, data }: { page: Page; data: TaskData }) => {
    await loadPage(page)
    await openFiltersPanel(page)
    await recursive({ page, data })
  })
  await cluster.queue(
    {
      filtersToGet: ['Category', 'Color', 'Size', 'Season'],
      existingFilters: [],
    },
    concurrent,
  )

  await cluster.idle()
  await cluster.close()

  await fs.writeFile(`${dir}/products.json`, JSON.stringify(products, null, 2))
  await fs.writeFile(`${dir}/filters.json`, JSON.stringify(filters, null, 2))

  const data = products.map((product) => {
    const productFilters = filters
      .filter((f) => f.product_cod10 === product.metadata?.product_cod10)
      .filter((f, i, a) => a.findIndex((f2) => filtersAreEqual(f, f2)) === i)
    return { ...product, filters: productFilters }
  })

  await fs.writeFile(`${dir}/data.json`, JSON.stringify(data, null, 2))
}

/**
 * Save the scraped data (from JSON) to our Prisma managed Postgres database.
 * @param dir - the directory to read the `data.json` file from.
 * @param seasonPrefix - a string to prefix unto season names (we need unique
 * season names to make saving data easier so we typically will prefix the name
 * found on a brand's website with the name of that brand to avoid collisions).
 */
export async function save(
  dir = 'data/marant',
  seasonPrefix = 'marant',
): Promise<void> {
  const data = await fs.readFile(`${dir}/data.json`, 'utf8')
  const products = JSON.parse(data) as (Required<Product> & {
    filters: Required<Filter>[]
  })[]

  const bar = new ProgressBar(
    'saving [:bar] :rate/pps :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: products.length,
    },
  )

  /* eslint-disable-next-line no-restricted-syntax */
  for await (const product of products) {
    const country: Prisma.CountryCreateOrConnectWithoutBrandsInput = {
      where: { code: 'fr' },
      create: { code: 'fr', name: 'france' },
    }
    const brand: Prisma.BrandCreateOrConnectWithoutSizesInput = {
      where: { name: 'isabel marant' },
      create: {
        name: 'isabel marant',
        description: '',
        tier: Tier.AFFORDABLE_LUXURY,
        company: {
          connectOrCreate: {
            where: { name: 'montefiore investment' },
            create: {
              name: 'montefiore investment',
              description: '',
              country: { connectOrCreate: country },
            },
          },
        },
        country: { connectOrCreate: country },
      },
    }
    const designer: Prisma.DesignerCreateOrConnectWithoutProductsInput = {
      where: { name: 'isabel marant' },
      create: {
        name: 'isabel marant',
        bornAt: new Date(2022, 3, 12),
        diedAt: undefined,
        country: { connectOrCreate: country },
      },
    }
    const styles: Prisma.StyleCreateOrConnectWithoutSizesInput[] =
      product.filters
        .filter((f) => f.title.toLowerCase() === 'category')
        .map((f) => ({
          where: { name: f.name.toLowerCase() },
          create: { name: f.name.toLowerCase() },
        }))
    const parentStyle: Prisma.StyleCreateOrConnectWithoutSizesInput = {
      where: { name: product.metadata.product_macro_category.toLowerCase() },
      create: { name: product.metadata.product_macro_category.toLowerCase() },
    }
    if (!styles.some((s) => s.where.name === parentStyle.where.name))
      styles.push(parentStyle)
    const childStyle: Prisma.StyleCreateOrConnectWithoutSizesInput = {
      where: { name: product.metadata.product_micro_category.toLowerCase() },
      create: {
        name: product.metadata.product_micro_category.toLowerCase(),
        parentStyle: { connectOrCreate: parentStyle },
      },
    }
    if (!styles.some((s) => s.where.name === childStyle.where.name))
      styles.push(childStyle)
    const sizes: Prisma.SizeCreateOrConnectWithoutProductsInput[] =
      product.filters
        .filter((f) => f.title.toLowerCase() === 'size')
        .map((f) => ({
          where: { name: f.name.toLowerCase() },
          create: {
            name: f.name.toLowerCase(),
            style: { connectOrCreate: parentStyle },
            sex: Sex.MAN,
            brand: { connectOrCreate: brand },
            country: undefined,
          },
        }))
    // TODO: Filter for duplicate products (that have the same name) that should
    // instead be represented as variants instead of separate products in db.
    const prices: Prisma.PriceCreateOrConnectWithoutProductInput[] = [
      {
        where: {
          value_url: {
            value: product.fullPrice.value as number,
            url: product.url,
          },
        },
        create: {
          value: product.fullPrice.value as number,
          url: product.url,
          market: Market.PRIMARY,
          brand: { connectOrCreate: brand },
          sizes: { connectOrCreate: sizes },
        },
      },
    ]
    if (product.salePrice) {
      prices.push({
        where: {
          value_url: {
            value: product.salePrice.value as number,
            url: product.url,
          },
        },
        create: {
          value: product.salePrice.value as number,
          url: product.url,
          market: Market.PRIMARY,
          brand: { connectOrCreate: brand },
          sizes: { connectOrCreate: sizes },
        },
      })
    }
    const collections: Prisma.CollectionCreateOrConnectWithoutProductsInput[] =
      product.filters
        .filter((f) => f.title.toLowerCase() === 'season' && getSeason(f))
        .map((f) => ({
          where: { name: `${seasonPrefix} ${f.name.toLowerCase()}` },
          create: {
            name: `${seasonPrefix} ${f.name.toLowerCase()}`,
            season: {
              connectOrCreate: {
                where: { name_year: getSeason(f) as Prisma.SeasonCreateInput },
                create: getSeason(f) as Prisma.SeasonCreateInput,
              },
            },
            designers: { connectOrCreate: [designer] },
            brands: { connectOrCreate: [brand] },
          },
        }))
    const image: Prisma.ImageCreateOrConnectWithoutProductInput = {
      where: { url: product.imageUrl },
      create: { url: product.imageUrl },
    }
    // TODO right now we create separate products for each colorway. instead, we
    // should create a single product with variants. to do so, we'll want to
    // filter and aggregate by name before running any prisma operations.
    await prisma.product.create({
      data: {
        name: product.name.toLowerCase(),
        level: Level.RTW,
        sizes: { connectOrCreate: sizes },
        msrp: product.fullPrice.value as number,
        prices: { connectOrCreate: prices },
        images: { connectOrCreate: [image] },
        // TODO is there any way that we can regularly get this information? if
        // not, perhaps we should make these fields optional or remove them.
        designedAt: new Date(),
        releasedAt: new Date(),
        styles: { connectOrCreate: styles },
        collections: { connectOrCreate: collections },
        designers: { connectOrCreate: [designer] },
        brands: { connectOrCreate: [brand] },
      },
    })
    bar.tick()
  }
}
