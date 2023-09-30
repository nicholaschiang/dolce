import { type DataFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function loader({ request }: DataFunctionArgs) {
  log.debug('getting sets...')
  const userId = await getUserId(request)
  if (userId == null) return []
  const search = new URL(request.url).searchParams.get('search') ?? ''
  const sets = await prisma.set.findMany({
    where: { authorId: userId, name: { contains: search.trim() } },
    orderBy: [{ updatedAt: 'desc' }],
    take: 100,
  })
  log.debug('got %d sets for query %s', sets.length, search)
  return sets
}
