// Script to save the data scraped via `scripts/python/spiders/shopify.py` to
// the Postgres database via the Prisma ORM for type safe data transformations.

import fs from 'fs'
import path from 'path'

import { type Prisma, Sex, Level, Market, PrismaClient } from '@prisma/client'
import ProgressBar from 'progress'
import sanitizeHtml from 'sanitize-html'

import example from './shopify/example.json'
import { slug, caps } from './utils'

const SKIP_PRODUCTS_WITH_TITLE = ['Aimé Leon Dore Gift Card']
const PATH = '../../../../static/data/shopify/aimeleondore.json'
const LEVEL = Level.RTW
const MARKET = Market.PRIMARY
const SEX = Sex.UNISEX
const BASE_URI = 'https://www.aimeleondore.com'
const DEFAULT_SIZE = 'OS' // "One Size" is the default size when there is none.
const SKIP_FIRST_IMAGE = true // The first image is a duplicate of the second.

type Product = typeof example

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const all = JSON.parse(json) as Product[]

  console.log(`Filtering ${all.length} products by blacklist...`)
  const filtered = all.filter(
    (p) => !SKIP_PRODUCTS_WITH_TITLE.includes(p.title),
  )
  console.log(`Filtered out ${all.length - filtered.length} products.`)

  console.log(`Parsing ${filtered.length} products...`)
  const data = filtered.map(getData)
  console.log(`Parsed ${data.length} products.`)

  // Combine duplicate products. Often, different product color variants will be
  // saved as separate products with the same name (i.e. Shopify "title").
  //
  // Note that I use the slug field instead of the name field as the slug is
  // more normalized and can account for inconsistencies with name spacing (e.g.
  // the "ALD Garden Mule" product has a bunch of erroneous spacing sometimes).
  console.log(`Combining ${data.length} products by slug...`)
  const products = data.reduce(
    (acc, product) => {
      const existing = acc.find((p) => p.slug === product.slug)
      if (existing) {
        existing.variants.connectOrCreate = [
          ...existing.variants.connectOrCreate,
          ...product.variants.connectOrCreate,
        ]
        existing.styles.connectOrCreate = [
          ...existing.styles.connectOrCreate,
          ...product.styles.connectOrCreate,
        ]
        existing.brands.connectOrCreate = [
          ...existing.brands.connectOrCreate,
          ...product.brands.connectOrCreate,
        ]
      } else {
        acc.push(product)
      }
      return acc
    },
    [] as ReturnType<typeof getData>[],
  )
  console.log(`Combined ${data.length - products.length} duplicate products.`)

  let index = Number(process.argv[2])
  if (Number.isNaN(index)) index = 0
  const final = products.slice(index)
  console.log(`Starting at index ${index}, saving ${final.length} products...`)
  const bar = new ProgressBar(
    'Saving Shopify products... [:bar] :rate/sps :current/:total :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: final.length,
    },
  )

  /* eslint-disable-next-line no-restricted-syntax */
  for await (const product of final) {
    try {
      await prisma.product.create({ data: product })
      bar.tick()
    } catch (error) {
      console.error(`Error while saving product:`, product)
      throw error
    }
  }
}

void save()

//////////////////////////////////////////////////////////////////

// Most of the time, the MSRP is the first variant's price. However, when there
// is a sale going on, the price will be inaccurate and we should prefer the
// compare_at_price. Occassionally, there will be inconsistencies between the
// compare_at_price in which case we will try to use the first non-zero value.
function getMSRP(product: Product): number | null {
  const compareAtPrices = product.variants
    .map((v) => Number(v.compare_at_price))
    .filter((p) => !Number.isNaN(p) && p !== 0)
  const prices = product.variants
    .map((v) => Number(v.price))
    .filter((p) => !Number.isNaN(p) && p !== 0)
  return compareAtPrices[0] ?? prices[0] ?? null
}

// Convert a Shopify product object to a Prisma product object.
function getData(product: Product) {
  const sizeOption = product.options.find((o) => o.name === 'Size')
  if (sizeOption == null)
    console.warn(
      `No size option found for ${product.title} (${product.id}), using "${DEFAULT_SIZE}" as default...`,
    )

  const colorOption = product.options.find((o) => o.name === 'Color')
  if (colorOption == null)
    throw new Error(`No color option found for product ${product.id}`)

  const style: Prisma.StyleCreateInput = { name: product.product_type }
  const brand: Prisma.BrandCreateInput = {
    name: product.vendor,
    slug: slug(product.vendor),
  }

  const images = product.images.map((i) => {
    const data: Prisma.ImageCreateInput = {
      url: i.src,
      position: i.position,
      width: i.width,
      height: i.height,
    }
    return data
  })

  // This rule only exists for Aime Leon Dore. It seems like the first image for
  // pretty much all their products is a duplicate of the second image just with
  // a different aspect ratio (i.e. first image is the square version, second
  // image is the 4x5 version with the same aspect ratio as the other images).
  // Ex (the ALD Garden Mule @ aimeleondore.com/products/ald-garden-mule):
  // 1st - https://cdn.shopify.com/s/files/1/0302/7829/files/AimeLeonDore641337787701146413377877178.085078966413377877178.jpg?v=1690214549
  // 2nd - https://cdn.shopify.com/s/files/1/0302/7829/products/4x5_SHOES_0005_SS23FD002_laureloak2.jpg?v=1679518863
  if (SKIP_FIRST_IMAGE && images.length > 1) images.shift()

  const variants = product.variants.map((v) => {
    const variantColor = colorOption
      ? v[`option${colorOption.position}` as 'option1']
      : ''
    const colorNames = variantColor.split(' / ').map((c) => caps(c.trim()))

    const variantSize = sizeOption
      ? v[`option${sizeOption.position}` as 'option2']
      : DEFAULT_SIZE
    const size: Prisma.SizeCreateWithoutVariantsInput = {
      name: variantSize,
      slug: slug(`${variantSize} ${SEX} ${style.name} ${brand.name}`),
      sex: SEX,
      brand: {
        connectOrCreate: { where: { slug: brand.slug }, create: brand },
      },
      style: {
        connectOrCreate: { where: { name: style.name }, create: style },
      },
    }

    // If it is available, we add the price as one of the Price[]. Otherwise, we
    // do not add it (the MSRP will already be saved to the Product).
    const price: Prisma.PriceCreateWithoutVariantInput = {
      value: Number(v.price),
      market: MARKET,
      url: `${BASE_URI}/products/${product.handle}`,
      available: v.available,
      brand: {
        connectOrCreate: { where: { slug: brand.slug }, create: brand },
      },
    }

    // TODO should I preserve the Shopify created_at and updated_at timestamps?
    const data: Prisma.VariantCreateWithoutProductInput = {
      sku: v.sku,
      colors: {
        connectOrCreate: colorNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
      // TODO infer the variant materials from the product description.
      materials: undefined,
      size: { connectOrCreate: { where: { slug: size.slug }, create: size } },
      // TODO if multiple products refer to the same image, we should make it
      // associated with a look instead and then associate the look with the
      // products.
      // TODO should I use the featured_image for anything? Right now, each
      // color is saved as its own Shopify product and then these variants are
      // only different due to size. All of the images on the product should
      // apply to every variant listed within the Shopify product.
      images: {
        connectOrCreate: images.map((i) => ({
          where: { url: i.url },
          create: i,
        })),
      },
      // Each price is unique to each variant, so there's no need to
      // connectOrCreate. We already connectOrCreate on the variants.
      prices: { create: price },
    }

    return data
  })

  // TODO perhaps I should preserve the Shopify created_at and updated_at
  // timestamps differently or more explicitly?
  // TODO preserve the product tags?
  const data = {
    name: product.title,
    slug: slug(product.title),
    // Remove unnecessary <br> tags from the product description and resolve all
    // relative links to the given BASE_URI (also open them in a new tab).
    description: sanitizeHtml(product.body_html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.filter((t) => t !== 'br'),
      transformTags: {
        a: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            href: new URL(attribs.href, BASE_URI).toString(),
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        }),
      },
    }),
    level: LEVEL,
    msrp: getMSRP(product),
    designedAt: product.created_at,
    releasedAt: product.published_at,
    variants: {
      connectOrCreate: variants.map((v) => ({
        where: { sku: v.sku },
        create: v,
      })),
    },
    // TODO do the tags include any product styles that we should link here?
    styles: {
      connectOrCreate: [{ where: { name: style.name }, create: style }],
    },
    // TODO infer the collection based on the product tags.
    collections: undefined,
    // TODO infer the product designers from the description?
    designers: undefined,
    // TODO infer collaboration brands from the product title?
    brands: {
      connectOrCreate: [{ where: { slug: brand.slug }, create: brand }],
    },
    // TODO infer the product looks based on image URLs.
    looks: undefined,
  } satisfies Prisma.ProductCreateInput
  return data
}
