import { Link, useLoaderData } from '@remix-run/react'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting sets...')
  const sets = await prisma.set.findMany({
    include: { author: true },
    orderBy: [{ updatedAt: 'desc' }],
    take: 100,
  })
  log.debug('got %d sets', sets.length)
  return sets
}

export default function SetsPage() {
  const sets = useLoaderData<typeof loader>()
  return (
    <ListLayout title='sets'>
      {sets.map((set) => {
        return (
          <li key={set.id}>
            {set.author.username ? (
              <Link
                prefetch='intent'
                className='link underline'
                to={`/${set.author.username}`}
              >
                {set.name} by @{set.author.username}
              </Link>
            ) : (
              <span>
                {set.name} by {set.author.name}
              </span>
            )}
          </li>
        )
      })}
    </ListLayout>
  )
}
