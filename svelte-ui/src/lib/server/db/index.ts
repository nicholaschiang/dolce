import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "$env/dynamic/private"

import * as tables from "./schema/tables"
import * as relations from "./schema/relations"

const schema = { ...tables, ...relations }

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set")

export const db = drizzle({ schema, connection: env.DATABASE_URL })
