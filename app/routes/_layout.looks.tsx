import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting looks...')
  const looks = await prisma.look.findMany({
    include: { show: true },
    orderBy: [{ show: { name: 'asc' } }, { number: 'asc' }],
    take: 100,
  })
  log.debug('got %d looks', looks.length)
  return looks
}

export default function LooksPage() {
  const looks = useLoaderData<typeof loader>()
  return (
    <ListLayout title='looks'>
      {looks.map((look) => {
        const filter: Filter<'looks', 'some'> = {
          id: nanoid(5),
          name: 'looks',
          condition: 'some',
          value: { id: look.id },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={look.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {look.show.name} Look {look.number}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
