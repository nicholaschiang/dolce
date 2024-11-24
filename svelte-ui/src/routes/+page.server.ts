import { db } from "$lib/server/db"

export async function load() {
  return {
    collections: db.query.collection.findMany({
      with: {
        brand: true,
      },
    }),
  }
}
