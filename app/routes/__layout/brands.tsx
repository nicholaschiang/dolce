import { Link, useLoaderData } from '@remix-run/react'
import type { Brand } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { ListLayout } from 'components/list-layout'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Brand[]

export const loader: LoaderFunction = async () => {
  log.debug('getting brands...')
  const brands = await prisma.brand.findMany()
  log.debug('got %d brands', brands.length)
  return json<LoaderData>(brands)
}

export default function BrandsPage() {
  const brands = useLoaderData<LoaderData>()
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
