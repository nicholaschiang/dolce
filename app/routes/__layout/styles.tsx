import { Link, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import type { Style } from '@prisma/client'
import { json } from '@remix-run/node'
import { nanoid } from 'nanoid'

import { ListLayout } from 'components/list-layout'

import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'
import { prisma } from 'db.server'

export type LoaderData = Style[]

export const loader: LoaderFunction = async () => {
  log.debug('getting styles...')
  const styles = await prisma.style.findMany()
  log.debug('got %d styles', styles.length)
  return json<LoaderData>(styles)
}

export default function StylesPage() {
  const styles = useLoaderData<LoaderData>()
  return (
    <ListLayout title='styles'>
      {styles.map((style) => {
        const filter: Filter<'styles', 'some'> = {
          id: nanoid(5),
          name: 'styles',
          condition: 'some',
          value: { id: style.id, name: style.name },
        }
        const param = filterToSearchParam(filter)
        return (
          <li key={style.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {style.name}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
