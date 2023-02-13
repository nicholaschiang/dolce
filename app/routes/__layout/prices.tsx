import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import type { Price } from '@prisma/client'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

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
    <main className='flex flex-1 items-center justify-center px-12'>
      <h1 className='my-4 mr-12 text-6xl'>prices</h1>
      <ul>
        {prices.map((price) => {
          const filter: Filter<'prices', 'some'> = {
            id: nanoid(5),
            name: 'prices',
            condition: 'some',
            value: { id: price.id, name: price.name },
          }
          const param = filterToSearchParam(filter)
          return (
            <li key={price.id}>
              <Link
                prefetch='intent'
                className='link underline'
                to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
              >
                {price.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
