import { asc, ilike, sql } from "drizzle-orm"
import * as tables from "$lib/server/db/schema/tables"
import { db } from "$lib/server/db"

const collectionsPageQuery = db.query.collection
  .findMany({
    columns: { id: true, name: true, level: true, location: true, sex: true },
    with: {
      brand: {
        columns: {
          id: true,
          name: true,
        },
      },
      season: {
        columns: { id: true, year: true, name: true },
      },
      looks: {
        columns: { id: true, number: true },
        with: {
          images: {
            limit: 1,
            columns: { id: true, url: true },
          },
        },
        orderBy: [asc(tables.look.number)],
      },
    },
    where: ilike(tables.collection.name, sql.placeholder("search")),
    orderBy: [
      asc(tables.collection.name),
      asc(tables.collection.level),
      asc(tables.collection.sex),
    ],
    limit: sql.placeholder("limit"),
  })
  .prepare("collectionsPageQuery")

export async function load({ url }) {
  const search = url.searchParams.get("q") ?? ""
  const query = collectionsPageQuery.getQuery()
  let sql = query.sql
  for (let i = 0; i < query.params.length; i++) {
    sql = sql.replace(`$${i + 1}`, `${query.params[i]}`)
  }
  return {
    search,
    sql,
    collections: collectionsPageQuery.execute({
      search: `%${search}%`,
      limit: search ? 100_000 : 100,
    }),
  }
}
