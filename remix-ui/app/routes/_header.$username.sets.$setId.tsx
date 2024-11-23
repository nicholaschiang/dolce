import { useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@vercel/remix'

import { SetItem } from 'components/set-item'

import { getItems } from 'utils/set'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  const setId = Number(params.setId)
  if (Number.isNaN(setId)) throw new Response('Not Found', { status: 404 })
  const set = await prisma.board.findUnique({
    where: { id: setId },
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
  if (set == null) throw new Response('Not Found', { status: 404 })
  return getItems(set)
}

export default function UserSetsPage() {
  const items = useLoaderData<typeof loader>()
  return (
    <ol className='grid grid-cols-5 gap-1'>
      {items.map((item) => (
        <SetItem key={item.id} item={item} />
      ))}
    </ol>
  )
}
