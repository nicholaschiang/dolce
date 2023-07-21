import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import type { Filter } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting designers...')
  const designers = await prisma.user.findMany({
    take: 100,
    include: { _count: { select: { products: true } } },
  })
  log.debug('got %d designers', designers.length)
  // TODO apply this filter at the database level instead of in JS.
  // eslint-disable-next-line no-underscore-dangle
  return designers.filter((designer) => designer._count.products > 0)
}

export default function DesignersPage() {
  const designers = useLoaderData<typeof loader>()
  return (
    <ListLayout title='designers'>
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
    </ListLayout>
  )
}
