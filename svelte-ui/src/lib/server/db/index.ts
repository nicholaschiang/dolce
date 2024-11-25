import { drizzle as postgres } from "drizzle-orm/node-postgres"
import { drizzle as neon } from "drizzle-orm/neon-http"
import { env } from "$env/dynamic/private"

import * as tables from "./schema/tables"
import * as relations from "./schema/relations"

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set")

const schema = { ...tables, ...relations }
const config = { schema, logger: true, connection: env.DATABASE_URL }

export const db = env.DATABASE_URL.includes("neon")
  ? neon(config)
  : postgres(config)
