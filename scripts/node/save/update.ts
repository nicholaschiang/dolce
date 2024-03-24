import { PrismaClient } from '@prisma/client'

import { reviews } from './shows/hermes'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

export async function save() {
  const create = reviews.filter((review) => !review.url?.includes('vogue.com'))
  await prisma.collection.update({
    where: { id: 775 },
    data: { articles: { create } },
  })
}

void save()
