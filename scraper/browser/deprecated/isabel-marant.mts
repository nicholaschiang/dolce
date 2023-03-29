import * as fs from 'fs/promises'

import * as cheerio from 'cheerio'
import { Level, Market, PrismaClient } from '@prisma/client'
import type { CheerioAPI } from 'cheerio'
import type { Prisma } from '@prisma/client'
import fetch from 'node-fetch'
import { pino } from 'pino'

import { headers } from './headers.mjs'

const BASE_URL = 'https://www.isabelmarant.com'
const log = pino({ level: 'debug' })
const prisma = new PrismaClient()

/**
 * Loads the page into Cheerio and returns the Cheerio instance.
 * @param path The path to the page to be loaded.
 * @example
 * const $ = await load('/c/designers-zegna-cat000495');
 */
export async function load(path: string): Promise<CheerioAPI> {
  log.debug('Fetching... %s', `${BASE_URL}${path}`)
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  log.debug('Fetched; parsing HTML... %s', `${BASE_URL}${path}`)
  const html = await res.text()
  log.trace('HTML: %s', html)
  return cheerio.load(html)
}

type IMProduct = {
  name: string
  price: string
  url?: string
  image?: string
  video?: string
}

/**
 * Gets a list of products from the page.
 * @param $ Cheerio instance with the page loaded.
 * @see {@link https://www.isabelmarant/us/isabel-marant/women/new-in-im-woman}
 * @todo load video.js and stream the blobs into a video file.
 */
export function getProductsFromPage($: CheerioAPI): IMProduct[] {
  return $('ul.products > li')
    .map((_, product) => ({
      name: $(product).find('.search-item-title').text().trim(),
      price: $(product).find('span.price > span').text().trim(),
      image: $(product).find('img').first().attr('src'),
      url: $(product).find('a.plp-product-link').attr('href'),
    }))
    .toArray()
}

export async function scrape(
  path = '/us/isabel-marant/women/new-in-im-woman',
  file = 'products.json',
): Promise<void> {
  log.info('Getting products... %s', path)
  const marantProducts = getProductsFromPage(await load(path))

  log.info('Got %d products; writing to file...', marantProducts.length)
  await fs.writeFile(file, JSON.stringify(marantProducts, null, 2))
}

export async function save(file = 'products.json'): Promise<void> {
  log.info('Reading products from file... %s', file)
  const marantProductsFile = await fs.readFile(file, 'utf-8')
  const marantProducts = JSON.parse(marantProductsFile) as IMProduct[]

  log.info('Saving %d products to our database...', marantProducts.length)
  const products: Prisma.ProductCreateInput[] = marantProducts.map(
    (product) => ({
      name: product.name,
      level: Level.RTW,
      prices: {
        create: [
          {
            value: Number(/([\d.]+)/.exec(product.price)?.[1]),
            market: Market.PRIMARY,
            url: product.url as string,
            brand: { connect: { name: 'Isabel Marant' } },
          },
        ],
      },
      images: { create: [{ url: product.image as string }] },
      designedAt: new Date(),
      releasedAt: new Date(),
      brands: { connect: [{ name: 'Isabel Marant' }] },
    }),
  )
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const product of products) {
    log.debug('Saving product... %s', product.name)
    await prisma.product.create({ data: product })
  }
}
