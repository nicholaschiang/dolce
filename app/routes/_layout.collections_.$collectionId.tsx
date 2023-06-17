import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'
import { nanoid } from 'nanoid/non-secure'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader({ params }: LoaderArgs) {
  log.debug('getting collection...')
  const collectionId = Number(params.collectionId)
  if (Number.isNaN(collectionId)) throw new Response(null, { status: 404 })
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  })
  log.debug('got collection %o', collection)
  if (collection == null) throw new Response(null, { status: 404 })
  return collection
}

export default function CollectionsPage() {
  const collection = useLoaderData<typeof loader>()
  const filter: Filter<'collections', 'some'> = {
    id: nanoid(5),
    name: 'collections',
    condition: 'some',
    value: { id: collection.id, name: collection.name },
  }
  const param = filterToSearchParam(filter)
  return (
    <main>
      <h1>{collection.name}</h1>
      <Link
        prefetch='intent'
        className='link underline'
        to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
      >
        products
      </Link>
    </main>
  )
}
