import { Link, useLoaderData } from '@remix-run/react'
import { type DataFunctionArgs } from '@vercel/remix'

import { prisma } from 'db.server'

export async function loader({ params }: DataFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const looks = await prisma.look.findMany({
    where: { sets: { some: { author: { username: params.username } } } },
    include: { images: { take: 1 } },
    orderBy: { updatedAt: 'desc' },
  })
  return looks
}

export default function UserSetsPage() {
  const looks = useLoaderData<typeof loader>()
  return (
    <ol className='grid grid-cols-6 gap-1'>
      {looks.map((look) => (
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
