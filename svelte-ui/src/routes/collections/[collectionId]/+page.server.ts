import { eq, Placeholder, sql } from "drizzle-orm"
import { error } from "@sveltejs/kit"
import * as tables from "$lib/server/db/schema/tables"
import { db } from "$lib/server/db"

const query = db.query.collection.findFirst({
    where: eq(tables.collection.id, sql.placeholder("collectionId")),
    with: {
      brand: true,
      season: true,
      articles: {
        with: {
          user_authorId: true,
          publication: true,
        },
      },
      looks: {
        with: {
          images: true,
        },
      },
    },
  }).prepare("collection")

async function getCollection(collectionId: number) {
  console.time(`collection-${collectionId}`)
  const start = performance.now() 
  const collection = await query.execute({ collectionId })
  const end = performance.now()
  console.timeEnd(`collection-${collectionId}`)
  const time = end - start
  console.log(`collection-${collectionId}: ${time}ms`)
 
  const q = query.getQuery()
  let sql = q.sql
  q.params.forEach((param, i) => {
    sql = sql.replaceAll(`$${i + 1}`, String(param instanceof Placeholder ? collectionId : param))
  })
  console.log(sql)

  if (collection == null) error(404, { message: "Collection Not Found" })
  return { collection, time }
}

export async function load({ params }) {
  const collectionId = Number(params.collectionId)
  if (isNaN(collectionId)) error(400, { message: "Invalid Collection ID" })
  return { data: getCollection(collectionId) }
}
