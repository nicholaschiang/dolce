import { Link, useLoaderData } from '@remix-run/react'
import type { Collection } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Collection[]

export const loader: LoaderFunction = async () => {
  log.debug('getting collections...')
  const collections = await prisma.collection.findMany()
  log.debug('got %d collections', collections.length)
  return json<LoaderData>(collections)
}

export default function CollectionsPage() {
  const collections = useLoaderData<LoaderData>()
  return (
    <main className='flex flex-1 items-center justify-center px-12'>
      <h1 className='my-4 mr-12 text-6xl'>collections</h1>
      <ul>
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
      </ul>
    </main>
  )
}
