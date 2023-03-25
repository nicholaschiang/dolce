import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid'

import { ListLayout } from 'components/list-layout'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export async function loader() {
  log.debug('getting collections...')
  const collections = await prisma.collection.findMany()
  log.debug('got %d collections', collections.length)
  return collections
}

export default function CollectionsPage() {
  const collections = useLoaderData<typeof loader>()
  return (
    <ListLayout title='collections'>
      {collections.map((collection) => {
        const filter: Filter<'collections', 'some'> = {
          id: nanoid(5),
          name: 'collections',
          condition: 'some',
          value: { id: collection.id, name: collection.name },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={collection.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {collection.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
