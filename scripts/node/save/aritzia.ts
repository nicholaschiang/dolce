import fs from 'fs/promises'

import { Level, Market, PrismaClient, Tier } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import ProgressBar from 'progress'

import { slug } from './utils'

type Product = {
  image: {
    alt: string
    title: string
    mouseover: string
    mouseout: string
    original: string
    srcset: string
    srcset_mouseover: string
    sizes: string
  }
  style: {
    name: string | null
    catid: string | null
    url: string
    category: string
  }
  uuid: string
  itemid: string
  mpid: string
  color: string
  pkey: string
  colors: string
  master: {
    name: string
    brand: string
    master: string
    category: string
    size: string
    color: string
    department: string
    price: string
    listprice: string
    currency: string
    issale: string
    genbuycode: string
    varbuycode: string
    model: string
    availability: string
    label: string
    climaterating: string
    specialorderdate: string
  }
  variant: {
    color: {
      id: string
      name: string
    }
    model: { id: string | null }
  }
  vg: string
  campaignimg: string
  url: string
  sales_price: string | null
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

function getLargestImageURL(srcset: string) {
  const urls = srcset.replace(/,/g, '').split(/\s/).filter(Boolean)
  const sizes = urls
    .filter((url) => /^(\d+)w$/.test(url))
    .map((size) => Number(/^(\d+)w$/.exec(size)?.[1]))
  return urls[urls.indexOf(`${sizes.sort().pop()}w`) - 1]
}

function getLargestImage(
  srcset: string,
): Prisma.ImageCreateOrConnectWithoutVariantInput {
  const url = getLargestImageURL(srcset)
  return { where: { url }, create: { url } }
}

async function save(dir = 'public/data/aritzia') {
  const data = await fs.readFile(`${dir}/data.json`, 'utf8')
  const products = JSON.parse(data) as Product[]

  const bar = new ProgressBar(
    'saving products [:bar] :rate/pps :current/:total :percent :etas',
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
      where: { code: 'ca' },
      create: { code: 'ca', name: 'canada' },
    }
    // TODO not all of the brands listed on Aritzia are owned by Aritzia or
    // based out of Canada (e.g. Adidas, Nike, Levi's, etc).
    const brand: Prisma.BrandCreateOrConnectWithoutSizesInput = {
      where: { name: product.master.brand.toLowerCase() },
      create: {
        name: product.master.brand.toLowerCase(),
        slug: slug(product.master.brand),
        description: '',
        tier: Tier.AFFORDABLE_LUXURY,
        company: {
          connectOrCreate: {
            where: { name: 'aritzia' },
            create: {
              name: 'aritzia',
              description: '',
              country: { connectOrCreate: country },
            },
          },
        },
        country: { connectOrCreate: country },
      },
    }
    const style: Prisma.StyleCreateOrConnectWithoutSizesInput = {
      where: {
        name: (product.style.name ?? product.style.category).toLowerCase(),
      },
      create: {
        name: (product.style.name ?? product.style.category).toLowerCase(),
        parent:
          product.style.name && product.style.name !== product.style.category
            ? {
                connectOrCreate: {
                  where: { name: product.style.category.toLowerCase() },
                  create: { name: product.style.category.toLowerCase() },
                },
              }
            : undefined,
      },
    }
    // TODO: Filter for duplicate products (that have the same name) that should
    // instead be represented as variants instead of separate products in db.
    const retailer: Prisma.RetailerCreateOrConnectWithoutPricesInput = {
      where: { name: 'aritzia' },
      create: { name: 'aritzia', description: '' },
    }
    const msrp = Number(product.master.listprice)
    const prices: Prisma.PriceCreateOrConnectWithoutVariantsInput[] = [
      {
        where: { value_url: { value: msrp, url: product.url } },
        create: {
          value: msrp,
          url: product.url,
          market: Market.PRIMARY,
          retailer: { connectOrCreate: retailer },
        },
      },
    ]
    const sale = Number(product.sales_price?.trim().replace('$', ''))
    if (!Number.isNaN(sale) && sale !== prices[0].create.value)
      prices.push({
        where: { value_url: { value: sale, url: product.url } },
        create: {
          value: sale,
          url: product.url,
          market: Market.PRIMARY,
          retailer: { connectOrCreate: retailer },
        },
      })
    const images: Prisma.ImageCreateOrConnectWithoutVariantInput[] = [
      getLargestImage(product.image.srcset),
      getLargestImage(product.image.srcset_mouseover),
    ]
    const description = `${product.master.name} from Aritzia`
    const variant: Prisma.VariantCreateWithoutProductInput = {
      name: product.variant.color.name.toLowerCase(),
      colors: {
        connectOrCreate: {
          where: { name: product.variant.color.name.toLowerCase() },
          create: { name: product.variant.color.name.toLowerCase() },
        },
      },
      images: { connectOrCreate: images },
      prices: { connectOrCreate: prices },
    }
    const productData = await prisma.product.findUnique({
      where: { description },
    })
    const productInput: Prisma.ProductCreateInput = {
      msrp,
      description,
      name: product.master.name.toLowerCase(),
      level: Level.RTW,
      // TODO is there any way that we can regularly get this information? if
      // not, perhaps we should make these fields optional or remove them.
      designedAt: new Date(),
      releasedAt: new Date(),
      variants: {
        connectOrCreate: productData
          ? {
              where: {
                name_productId: {
                  name: variant.name,
                  productId: productData.id,
                },
              },
              create: variant,
            }
          : undefined,
        create: productData ? undefined : variant,
      },
      styles: { connectOrCreate: [style] },
      brands: { connectOrCreate: [brand] },
    }
    await prisma.product.upsert({
      create: productInput,
      update: productInput,
      where: { description: productInput.description },
    })
    bar.tick()
  }
}

void save()
