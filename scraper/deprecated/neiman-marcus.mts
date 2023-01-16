import * as fs from 'fs/promises';

import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import fetch from 'node-fetch';
import { pino } from 'pino';

import { headers } from './headers.mjs';

const BASE_URL = 'https://www.neimanmarcus.com';
const log = pino({ level: 'debug' });

/*
 *export type ProductCreateWithoutBrandsInput = {
 *  name: string;
 *  level: number;
 *  sizes?: SizeCreateNestedManyWithoutProductsInput;
 *  prices?: PriceCreateNestedManyWithoutProductInput;
 *  designedAt: Date | string;
 *  releasedAt: Date | string;
 *  styles?: StyleCreateNestedManyWithoutProductsInput;
 *  season: SeasonCreateNestedOneWithoutProductsInput;
 *  collections?: CollectionCreateNestedManyWithoutProductsInput;
 *  shows?: ShowCreateNestedManyWithoutProductsInput;
 *  designers?: DesignerCreateNestedManyWithoutProductsInput;
 *};
 */

/**
 * Loads the Neiman Marcus page into Cheerio and returns the Cheerio instance.
 * @param path The path to the Neiman Marcus page to be loaded.
 * @example
 * const $ = await load('/c/designers-zegna-cat000495');
 */
export async function load(path: string): Promise<CheerioAPI> {
  log.debug('Fetching... %s', `${BASE_URL}${path}`);
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  const html = await res.text();
  log.trace('HTML: %s', html);
  return cheerio.load(html);
}

type NMBrand = { name: string; url?: string };

/**
 * Gets a list of brands from Neiman Marcus' designers page.
 * @param $ Cheerio instance with the designers page loaded.
 * @see {@link https://www.neimanmarcus.com/c/designers-cat000730}
 */
export function getBrandsFromDesignersPage($: CheerioAPI): NMBrand[] {
  return $('div.designer-link')
    .map((_, brand) => ({
      name: $(brand).find('a').text(),
      url: $(brand).find('a').attr('href'),
    }))
    .toArray();
}

type NMProduct = {
  id?: string;
  name: string;
  price: string;
  coverPhotoUrl?: string;
  url?: string;
};

/**
 * Gets a list of products from Neiman Marcus' brand specific page.
 * @param $ Cheerio instance with the brand specific page loaded.
 * @see {@link https://www.neimanmarcus.com/c/designers-zegna-cat000495}
 */
export function getProductsFromBrandPage($: CheerioAPI): NMProduct[] {
  return $('.product-list')
    .children('.product-thumbnail')
    .map((_, product) => ({
      id: $(product).attr('id'),
      url: $(product).find('a.product-thumbnail__link').attr('href'),
      name: $(product).find('h2 span.name').text(),
      price: $(product).find('.product-thumbnail__description__price').text(),
      coverPhotoUrl: $(product).find('img[name="mainImage"]').attr('src'),
    }))
    .toArray();
}

type NMStyle = { name: string; url?: string };

/**
 * Gets a list of styles from Neiman Marcus' brand specific page.
 * @param $ Cheerio instance with the brand specific page loaded.
 * @see {@link https://www.neimanmarcus.com/c/designers-zegna-cat000495}
 * @todo this does not work with Cheerio as we have to click the "+" button.
 */
export function getStylesFromBrandPage($: CheerioAPI): NMStyle[] {
  return $('.faceted-left-nav__filter__title div:contains("Style")')
    .closest('.faceted-left-nav__filter')
    .find('ul')
    .children('li')
    .map((_, style) => ({
      name: $(style).find('a').text(),
      url: $(style).find('a').attr('href'),
    }))
    .toArray();
}

/**
 * Scrapes the Neiman Marcus website for products, brands, styles, etc.
 * @param designersPath The path to the designers page where we start scraping.
 * @example
 * await scrape('/c/designers-cat000730');
 */
export async function scrape(
  designersPath = '/c/designers-cat000730'
): Promise<void> {
  log.info('Getting brands from Neiman Marcus... %s', designersPath);
  const brands = getBrandsFromDesignersPage(await load(designersPath));
  await fs.writeFile('brands.json', JSON.stringify(brands, null, 2));
  log.info('Got %d brands from Neiman Marcus.', brands.length);
  const products: (NMProduct & { brand: NMBrand })[] = [];
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const brand of brands) {
    log.info('Getting %s products... %s', brand.name, brand.url);
    if (!brand.url) {
      log.warn('Missing URL for %s products.', brand.name);
      /* eslint-disable-next-line no-continue */
      continue;
    }
    const brandProducts = getProductsFromBrandPage(await load(brand.url));
    brandProducts.forEach((product) => {
      if (products.some((p) => p.id === product.id))
        log.warn(
          'Found duplicate product %s from %s.',
          product.name,
          brand.name
        );
      else products.push({ ...product, brand });
    });
    log.info('Got %d %s products.', brandProducts.length, brand.name);
    await fs.writeFile('products.json', JSON.stringify(products, null, 2));
  }
}
