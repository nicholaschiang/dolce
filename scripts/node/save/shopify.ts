// Script to save the data scraped via `scripts/python/spiders/shopify.py` to
// the Postgres database via the Prisma ORM for type safe data transformations.

import fs from 'fs'
import path from 'path'

import { type Prisma, Sex, Level, Market, PrismaClient } from '@prisma/client'
import ProgressBar from 'progress'
import sanitizeHtml from 'sanitize-html'

import example from './shopify/example.json'
import { slug, caps } from './utils'

const SKIP_PRODUCTS_WITH_TITLE: string[] = []
const PATH = '../../../../static/data/shopify/kith.json'
const LEVEL = Level.RTW
const MARKET = Market.PRIMARY
const SEX = Sex.UNISEX
const BRAND_NAME = 'Kith' // The brand name that these prices should be from.
const BASE_URI = 'https://kith.com'
const BRAND: Prisma.BrandCreateInput = {
  name: BRAND_NAME,
  slug: slug(BRAND_NAME),
  url: BASE_URI,
}
const DEFAULT_SIZE = 'OS' // "One Size" is the default size when there is none.
const SKIP_FIRST_IMAGE = false // The first image is a duplicate of the second.

type Product = typeof example

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const json = fs.readFileSync(path.resolve(__dirname, PATH), 'utf8')
  const all = JSON.parse(json) as Product[]

  console.log(`Filtering ${all.length} products by blacklist...`)
  const filtered1 = all.filter(
    (p) => !SKIP_PRODUCTS_WITH_TITLE.includes(p.title),
  )
  console.log(`Filtered out ${all.length - filtered1.length} products.`)

  // Filter out products that are actually looks. KITH seems to save all their
  // looks as products that can be shown inline with products.
  // Ex: https://kith.com/products/kith-spring-2-2022-look-15
  console.log(`Filtering looks from ${filtered1.length} products...`)
  const filtered2 = filtered1.filter((p) => !p.title.includes(' - Look'))
  console.log(`Filtered out ${filtered1.length - filtered2.length} looks.`)

  console.log(`Parsing ${filtered2.length} products...`)
  const data = filtered2.map(getData)
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
    const upsert = {
      where: { slug: product.slug },
      create: product,
      update: getUpdateData(product),
    }
    try {
      await prisma.product.upsert(upsert)
      bar.tick()
    } catch (error) {
      console.error(
        `Error while saving product:`,
        JSON.stringify(upsert, null, 2),
      )
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
  // KITH (like Aime Leon Dore) saves each color variant of a product as a
  // separate Shopify product. However, unlike Aime Leon Dore, they do not have
  // a color variant option. Instead, they just append the color name to the
  // product title (concatenated with a " - " string).
  const [title, color] = product.title.split(' - ').map((s) => s.trim())
  const url = `${BASE_URI}/products/${product.handle}`

  // TODO perhaps I should do something with the KITH "title" option?
  // Ex: The following have different title options and are similar products:
  // - https://kith.com/products/ma2301102-s-fw23
  // - https://kith.com/products/ma2301101-s-fw23

  const sizeOption = product.options.find(
    (o) => o.name.toLowerCase() === 'size',
  )
  if (sizeOption == null)
    console.warn(`[MISSING SIZE] ${product.title} (${url})`)

  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === 'color',
  )
  if (colorOption == null && color == null)
    console.warn(`[MISSING COLOR] ${product.title} (${url})`)

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
      : color ?? ''
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
      url,
      available: v.available,
      brand: {
        connectOrCreate: { where: { slug: BRAND.slug }, create: BRAND },
      },
    }

    const tags: Prisma.TagCreateWithoutVariantsInput[] = product.tags.map(
      (tag) => ({ name: tag }),
    )

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
      tags: {
        connectOrCreate: tags.map((t) => ({
          where: { name: t.name },
          create: t,
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
    name: title,
    slug: slug(title),
    // Remove unnecessary <br> tags from the product description and resolve all
    // relative links to the given BASE_URI (also open them in a new tab).
    // TODO perhaps the product description should be on the variant instead?
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
      connectOrCreate: variants
        .filter((v) => {
          if (v.sku == null) {
            console.warn(`[MISSING SKU] ${product.title} (${url})`)
            return false
          }
          return true
        })
        .map((v) => ({
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

// Ensure that deeply nested connectOrCreate relations are upserted as well.
function getUpdateData(
  data: ReturnType<typeof getData>,
): Prisma.ProductUpdateInput {
  // TODO make this recursively replace all connectOrCreate with upsert. This
  // should work mostly for now as all the nested connectOrCreate relations do
  // not need to be upserted but simply created if they don't exist.
  return {
    ...data,
    variants: {
      upsert: data.variants.connectOrCreate.map((v) => ({
        where: v.where,
        create: v.create,
        // TODO allow creating a new price if it is a different source or a
        // different value. Right now, I can't easily do that because I do not
        // know the variantId at save time. I should probably add a unique slug
        // to the price model that is derived from the variant SKU and the price
        // URL and value.
        update: { ...v.create, prices: undefined },
      })),
    },
    styles: {
      upsert: data.styles.connectOrCreate.map((s) => ({
        where: s.where,
        create: s.create,
        update: s.create,
      })),
    },
    brands: {
      upsert: data.brands.connectOrCreate.map((b) => ({
        where: b.where,
        create: b.create,
        update: b.create,
      })),
    },
  }
}
