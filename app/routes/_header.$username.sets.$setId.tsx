import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: LoaderArgs) {
  const setId = Number(params.setId)
  if (Number.isNaN(setId)) throw new Response('Not Found', { status: 404 })
  const set = await prisma.set.findUnique({
    where: { id: setId },
    include: {
      looks: {
        orderBy: { updatedAt: 'desc' },
        include: { images: { take: 1 } },
      },
    },
  })
  if (set == null) throw new Response('Not Found', { status: 404 })
  return set
}

export default function UserSetsPage() {
  const set = useLoaderData<typeof loader>()
  return (
    <ol className='grid grid-cols-5 gap-1'>
      {set.looks.map((look) => (
        <li key={look.id}>
          <Link
            to={`/shows/${look.showId}`}
            prefetch='intent'
            className='aspect-person bg-gray-100 dark:bg-gray-900 block'
          >
            {look.images.length > 0 && (
              <img
                className='object-cover w-full h-full'
                src={look.images[0].url}
                alt=''
              />
            )}
          </Link>
        </li>
      ))}
    </ol>
  )
}
