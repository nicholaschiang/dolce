import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting variants...')
  const variants = await prisma.variant.findMany({
    take: 100,
    include: { colors: true },
  })
  log.debug('got %d variants', variants.length)
  return variants
}

export default function VariantsPage() {
  const variants = useLoaderData<typeof loader>()
  return (
    <ListLayout title='variants'>
      {variants.map((variant) => {
        const param = filterToSearchParam<'variants', 'some'>({
          id: nanoid(5),
          name: 'variants',
          condition: 'some',
          value: { id: variant.id, name: variant.name },
        })
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
    </ListLayout>
  )
}
