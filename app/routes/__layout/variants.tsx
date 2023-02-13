import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import type { Variant } from '@prisma/client'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Variant[]

export const loader: LoaderFunction = async () => {
  log.debug('getting variants...')
  const variants = await prisma.variant.findMany()
  log.debug('got %d variants', variants.length)
  return json<LoaderData>(variants)
}

export default function VariantsPage() {
  const variants = useLoaderData<LoaderData>()
  return (
    <main className='flex flex-1 items-center justify-center px-12'>
      <h1 className='my-4 mr-12 text-6xl'>variants</h1>
      <ul>
        {variants.map((variant) => {
          const filter: Filter<'variants', 'some'> = {
            id: nanoid(5),
            name: 'variants',
            condition: 'some',
            value: { id: variant.id, name: variant.name },
          }
          const param = filterToSearchParam(filter)
          return (
            <li key={variant.id}>
              <Link
                prefetch='intent'
                className='link underline'
                to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
              >
                {variant.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
