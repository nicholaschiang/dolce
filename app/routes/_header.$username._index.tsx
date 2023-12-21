import { useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@vercel/remix'

import { SetItem } from 'components/set-item'

import { getItems } from 'utils/set'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const sets = await prisma.board.findMany({
    where: { author: { username: params.username } },
    include: {
      variants: {
        orderBy: { updatedAt: 'desc' },
        include: { images: { take: 1 }, product: true },
      },
      looks: {
        orderBy: { updatedAt: 'desc' },
        include: { images: { take: 1 } },
      },
    },
  })
  return sets.flatMap(getItems)
}

export default function UserSetsPage() {
  const items = useLoaderData<typeof loader>()
  return (
    <ol className='grid grid-cols-6 gap-1'>
      {items.map((item) => (
        <SetItem key={item.id} item={item} />
      ))}
    </ol>
  )
}
