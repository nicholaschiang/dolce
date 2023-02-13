import { Link, useLoaderData } from '@remix-run/react'
import type { Designer } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Designer[]

export const loader: LoaderFunction = async () => {
  log.debug('getting designers...')
  const designers = await prisma.designer.findMany()
  log.debug('got %d designers', designers.length)
  return json<LoaderData>(designers)
}

export default function DesignersPage() {
  const designers = useLoaderData<LoaderData>()
  return (
    <main className='flex flex-1 items-center justify-center px-12'>
      <h1 className='my-4 mr-12 text-6xl'>designers</h1>
      <ul>
        {designers.map((designer) => {
          const filter: Filter<'designers', 'some'> = {
            id: nanoid(5),
            name: 'designers',
            condition: 'some',
            value: { id: designer.id, name: designer.name },
          }
          const param = filterToSearchParam(filter)
          return (
            <li key={designer.id}>
              <Link
                prefetch='intent'
                className='link underline'
                to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
              >
                {designer.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
