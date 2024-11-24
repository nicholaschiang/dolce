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
  .leftJoin(
    tables.look,
    and(
      eq(tables.look.collectionId, tables.collection.id),
      eq(tables.look.number, 1),
    ),
  )
  .leftJoin(tables.image, eq(tables.image.lookId, tables.look.id))
  .orderBy(desc(tables.collection.name))
  .where(ilike(tables.collection.name, sql.placeholder("search")))
  .prepare("collections")

export async function load({ url }) {
  const search = url.searchParams.get("q") ?? ""
  return { collections: query.execute({ search: `%${search}%` }) }
}
