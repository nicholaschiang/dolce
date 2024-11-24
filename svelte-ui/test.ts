import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as tables from "./src/lib/server/db/schema/tables"
import * as relations from "./src/lib/server/db/schema/relations"

const schema = { ...tables, ...relations }

const db = drizzle({ schema, connection: process.env.DATABASE_URL })

async function main() {
  const collections = await db.query.collection.findMany({
    with: {
      brand: true,
    },
  })
  collections.forEach((c) => {
    console.log("Collection:", c)
  })
  console.log("Collections:", collections)
}

main()
