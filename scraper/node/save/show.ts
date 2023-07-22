import { PrismaClient } from '@prisma/client'

import { show as hermes } from './shows/hermes'
import { show as marant } from './shows/isabel-marant'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  await prisma.show.create({ data: hermes })
  await prisma.show.create({ data: marant })
}

void save()
