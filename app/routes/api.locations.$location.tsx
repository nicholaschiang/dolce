import { Location } from '@prisma/client'
import { type LoaderArgs } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderArgs) {
  if (!params.location) throw new Response('Not Found', { status: 404 })
  const shows = await prisma.show.findMany({
    where: {
      location: params.location as Location,
      looks: { some: { images: { some: {} } } },
    },
    include: { looks: { include: { images: { take: 1 } }, take: 1 } },
    orderBy: { date: 'desc' },
    take: 12,
  })
  return shows
}
