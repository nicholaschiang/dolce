import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting sizes...')
  const sizes = await prisma.size.findMany({ take: 100 })
  log.debug('got %d sizes', sizes.length)
  return sizes
}

export default function SizesPage() {
  const sizes = useLoaderData<typeof loader>()
  return (
    <ListLayout title='sizes'>
      {sizes.map((size) => {
        const filter: Filter<'sizes', 'some'> = {
          id: nanoid(5),
          name: 'sizes',
          condition: 'some',
          value: { id: size.id, name: size.name },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={size.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {size.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
