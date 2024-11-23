import { PrismaClient } from '@prisma/client'

import { collection as hermes } from './shows/hermes'
import { collection as marant } from './shows/isabel-marant'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  await prisma.collection.create({ data: hermes })
  await prisma.collection.create({ data: marant })
}

void save()
