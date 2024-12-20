import { type LoaderFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  log.debug('getting sets...')
  const userId = await getUserId(request)
  if (userId == null) return []
  const search = new URL(request.url).searchParams.get('search') ?? ''
  const sets = await prisma.board.findMany({
    where: { authorId: userId, name: { contains: search.trim() } },
    orderBy: [{ updatedAt: 'desc' }],
    take: 100,
  })
  log.debug('got %d sets for query %s', sets.length, search)
  return sets
}
