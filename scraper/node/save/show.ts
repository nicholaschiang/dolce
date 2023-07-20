import { PrismaClient } from '@prisma/client'

import { show } from './shows/hermes'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  await prisma.show.create({ data: show })
}

void save()
