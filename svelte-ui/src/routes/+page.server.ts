import { desc, ilike, and, eq, sql } from "drizzle-orm"
import * as tables from "$lib/server/db/schema/tables"
import { db } from "$lib/server/db"

const query = db
  .selectDistinctOn([tables.collection.name], {
    collectionId: tables.collection.id,
    collectionName: tables.collection.name,
    collectionDate: tables.collection.date,
    collectionLocation: tables.collection.location,
    lookNumber: tables.look.number,
    lookImageUrl: tables.image.url,
  })
  .from(tables.collection)
  .leftJoin(tables.look, eq(tables.look.collectionId, tables.collection.id))
  .leftJoin(tables.image, eq(tables.image.lookId, tables.look.id))
  .orderBy(desc(tables.collection.name))
  .where(
    and(
      eq(tables.look.number, 1),
      ilike(tables.collection.name, sql.placeholder("search")),
    ),
  )
  .prepare("collections")

async function getCollections(search: string) {
  console.time(`collections-${search}`)
  const start = performance.now() 
  const collections = await query.execute({ search: `%${search}%` })
  const end = performance.now()
  console.timeEnd(`collections-${search}`)
  const time = end - start
  console.log(`collections-${search}: ${time}ms`)
  return { collections, time }
}

export async function load({ url }) {
  const search = url.searchParams.get("q") ?? ""
  return { data: getCollections(search) }
}
