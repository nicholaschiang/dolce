import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting designers...')
  const designers = await prisma.user.findMany({
    where: { products: { some: {} } },
    take: 100,
  })
  log.debug('got %d designers', designers.length)
  return designers
}

export default function DesignersPage() {
  const designers = useLoaderData<typeof loader>()
  return (
    <ListLayout title='designers'>
      {designers.map((designer) => {
        const param = filterToSearchParam<'designers', 'some'>({
          id: nanoid(5),
          name: 'designers',
          condition: 'some',
          value: { id: designer.id, name: designer.name },
        })
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
