import { type LoaderArgs, redirect } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const set = await prisma.set.findFirst({
    where: { author: { username: params.username } },
    orderBy: { updatedAt: 'desc' },
  })
  if (set == null) throw new Response('Not Found', { status: 404 })
  return redirect(set.id.toString())
}
