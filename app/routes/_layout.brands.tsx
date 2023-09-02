import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam, getSearch } from 'filters'
import { log } from 'log.server'

export async function loader({ request }: LoaderArgs) {
  log.debug('getting brands...')
  const search = getSearch(request)
  const brands = await prisma.brand.findMany({
    orderBy: { _relevance: { search, fields: 'name', sort: 'desc' } },
    take: 100,
  })
  log.debug('got %d brands', brands.length)
  return brands
}

export default function BrandsPage() {
  const brands = useLoaderData<typeof loader>()
  return (
    <ListLayout title='brands'>
      {brands.map((brand) => {
        const param = filterToSearchParam<'brand', 'is'>({
          id: nanoid(5),
          name: 'brand',
          condition: 'is',
          value: { id: brand.id, name: brand.name },
        })
        return (
          <li key={brand.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/shows?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {brand.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
