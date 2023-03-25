import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid'

import { ListLayout } from 'components/list-layout'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export async function loader() {
  log.debug('getting prices...')
  const prices = await prisma.price.findMany()
  log.debug('got %d prices', prices.length)
  return prices
}

export default function PricesPage() {
  const prices = useLoaderData<typeof loader>()
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
