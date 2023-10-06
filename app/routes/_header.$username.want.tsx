import { useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'

import { SetItem } from 'components/set-item'

import { WANT_SET_NAME, getItems } from 'utils/set'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function loader({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request)
  const set = await prisma.set.findUnique({
    where: { name_authorId: { name: WANT_SET_NAME, authorId: userId } },
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

export default function WantPage() {
  const items = useLoaderData<typeof loader>()
  return (
    <ol className='grid grid-cols-5 gap-1'>
      {items.map((item) => (
        <SetItem key={item.id} item={item} />
      ))}
    </ol>
  )
}
