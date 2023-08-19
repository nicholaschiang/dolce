import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam, getSearch } from 'filters'
import { log } from 'log.server'

export async function loader({ request }: LoaderArgs) {
  log.debug('getting collections...')
  const search = getSearch(request)
  const collections = await prisma.collection.findMany({
    orderBy: { _relevance: { search, fields: 'name', sort: 'desc' } },
    take: 100,
  })
  log.debug('got %d collections', collections.length)
  return collections
}

export default function CollectionsPage() {
  const collections = useLoaderData<typeof loader>()
  return (
    <ListLayout title='collections'>
      {collections.map((collection) => {
        const param = filterToSearchParam<'collections', 'some'>({
          id: nanoid(5),
          name: 'collections',
          condition: 'some',
          value: { id: collection.id, name: collection.name },
        })
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
