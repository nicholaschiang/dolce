import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import type { Price } from '@prisma/client'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { ListLayout } from 'components/list-layout'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Price[]

export const loader: LoaderFunction = async () => {
  log.debug('getting prices...')
  const prices = await prisma.price.findMany()
  log.debug('got %d prices', prices.length)
  return json<LoaderData>(prices)
}

export default function PricesPage() {
  const prices = useLoaderData<LoaderData>()
  return (
    <ListLayout title='prices'>
      {prices.map((price) => {
        const filter: Filter<'prices', 'some'> = {
          id: nanoid(5),
          name: 'prices',
          condition: 'some',
          value: { id: price.id },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={price.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              ${Number(price.value).toFixed(2)}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
