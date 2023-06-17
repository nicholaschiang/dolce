import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting styles...')
  const styles = await prisma.style.findMany({ take: 100 })
  log.debug('got %d styles', styles.length)
  return styles
}

export default function StylesPage() {
  const styles = useLoaderData<typeof loader>()
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
