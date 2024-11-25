import { eq } from "drizzle-orm"
import * as tables from "$lib/server/db/schema/tables"
import { db } from "$lib/server/db"

export async function load({ params }) {
  return {
    collection: db.query.collection
      .findMany({
        where: eq(tables.collection.id, params.collectionId),
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
      })
      .then((collections) => collections[0]),
  }
}
