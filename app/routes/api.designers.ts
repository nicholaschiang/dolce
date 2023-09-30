import { type DataFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'
import { getSearch } from 'filters'
import { log } from 'log.server'
import { getUserId } from 'session.server'

export async function loader({ request }: DataFunctionArgs) {
  log.debug('getting designers...')
  const userId = await getUserId(request)
  if (userId == null) return []
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user == null) throw new Response('Not Found', { status: 404 })
  if (user.curator === false) throw new Response('Forbidden', { status: 403 })
  const search = getSearch(request)
  const designers = await prisma.user.findMany({
    where: { articles: { some: {} }, name: { search } },
    orderBy: [{ updatedAt: 'desc' }],
    take: 100,
  })
  log.debug('got %d designers for query %s', designers.length, search)
  return designers
}
