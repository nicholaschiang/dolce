import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting brands...')
  const brands = await prisma.brand.findMany({ take: 100 })
  log.debug('got %d brands', brands.length)
  return brands
}

export default function BrandsPage() {
  const brands = useLoaderData<typeof loader>()
  return (
    <ListLayout title='brands'>
      {brands.map((brand) => {
        const filter: Filter<'brands', 'some'> = {
          id: nanoid(5),
          name: 'brands',
          condition: 'some',
          value: { id: brand.id, name: brand.name },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={brand.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {brand.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
