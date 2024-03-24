import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam, getSearch } from 'filters'
import { log } from 'log.server'

export async function loader({ request }: LoaderFunctionArgs) {
  log.debug('getting shows...')
  const search = getSearch(request)
  const shows = await prisma.show.findMany({
    orderBy: { _relevance: { search, fields: 'name', sort: 'desc' } },
    take: 100,
  })
  log.debug('got %d shows', shows.length)
  return shows
}

export default function ShowsPage() {
  const shows = useLoaderData<typeof loader>()
  return (
    <ListLayout title='shows'>
      {shows.map((show) => {
        const param = filterToSearchParam<'shows', 'some'>({
          id: nanoid(5),
          name: 'shows',
          condition: 'some',
          value: { id: show.id, name: show.name },
        })
        return (
          <li key={show.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {show.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
