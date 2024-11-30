import { asc, desc, ilike, eq, sql } from "drizzle-orm"
import * as tables from "$lib/server/db/schema/tables"
import { db } from "$lib/server/db"
import { PARAM } from "$lib/constants"

const query = db
  .selectDistinctOn([tables.product.name], {
    productId: tables.product.id,
    productName: tables.product.name,
    priceValue: tables.price.value,
    priceUrl: tables.price.url,
    brandName: tables.brand.name,
    imageUrl: tables.image.url,
  })
  .from(tables.product)
  .leftJoin(tables.brandToProduct, eq(tables.brandToProduct.b, tables.product.id))
  .leftJoin(tables.brand, eq(tables.brand.id, tables.brandToProduct.a))
  .leftJoin(tables.variant, eq(tables.variant.productId, tables.product.id))
  .leftJoin(tables.price, eq(tables.price.variantId, tables.variant.id))
  .leftJoin(tables.imageToVariant, eq(tables.imageToVariant.b, tables.variant.id))
  .leftJoin(tables.image, eq(tables.imageToVariant.a, tables.image.id))
  .orderBy(
    desc(tables.product.name),
    asc(tables.price.value),
    asc(tables.image.position),
  )
  .where(ilike(tables.product.name, sql.placeholder("search")))
  .prepare("products")

async function getProducts(search: string) {
  console.time(`products-${search}`)
  const start = performance.now() 
  const products = await query.execute({ search: `%${search}%` })
  const end = performance.now()
  console.timeEnd(`products-${search}`)
  const time = end - start
  console.log(`products-${search}: ${time}ms`)
  return { products, time }
}

export async function load({ url }) {
  const search = url.searchParams.get(PARAM) ?? "" 
  return { data: getProducts(search) }
}
