import { Location } from '@prisma/client'
import { type LoaderFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.location) throw new Response('Not Found', { status: 404 })
  const collections = await prisma.collection.findMany({
    where: {
      location: params.location as Location,
      looks: { some: { images: { some: {} } } },
    },
    include: { looks: { include: { images: { take: 1 } }, take: 1 } },
    orderBy: { date: 'desc' },
    take: 12,
  })
  return collections
}
