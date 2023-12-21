import { type LoaderFunctionArgs, redirect, json } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const set = await prisma.set.findFirst({
    where: { author: { username: params.username } },
    orderBy: { updatedAt: 'desc' },
  })
  return set ? redirect(set.id.toString()) : json({})
}

export default function SetsIndexPage() {
  return null
}
