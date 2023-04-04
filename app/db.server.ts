import { PrismaClient } from '@prisma/client'
import invariant from 'tiny-invariant'

function getClient() {
  const { DATABASE_URL } = process.env
  invariant(typeof DATABASE_URL === 'string', 'DATABASE_URL env var not set')

  const databaseUrl = new URL(DATABASE_URL)

  const isLocalHost = databaseUrl.hostname === 'localhost'

  const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION
  const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION

  const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION

  if (!isLocalHost) {
    databaseUrl.host = FLY_REGION
      ? `${FLY_REGION}.${databaseUrl.host}`
      : databaseUrl.host
    if (!isReadReplicaRegion) databaseUrl.port = '5433' // the read-replica port
  }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`)
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  })
  // connect eagerly
  void client.$connect()

  return client
}

/* eslint-disable-next-line import/no-mutable-exports */
let prisma: PrismaClient

declare global {
  /* eslint-disable-next-line no-var, vars-on-top */
  var db: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
  prisma = getClient()
} else {
  if (!global.db) global.db = getClient()
  prisma = global.db
}

export { prisma }
