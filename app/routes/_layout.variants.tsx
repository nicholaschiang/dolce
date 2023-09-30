import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs } from '@vercel/remix'

import { ListLayout } from 'components/list-layout'

import { getColorFilter, getColorName } from 'utils/variant'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam, getSearch } from 'filters'
import { log } from 'log.server'

export async function loader({ request }: LoaderArgs) {
  log.debug('getting variants...')
  const search = getSearch(request)
  const variants = await prisma.variant.findMany({
    take: 100,
    include: { colors: true },
    where: search ? { colors: { some: { name: { search } } } } : undefined,
  })
  log.debug('got %d variants', variants.length)
  return variants
}

export default function VariantsPage() {
  const variants = useLoaderData<typeof loader>()
  return (
    <ListLayout title='variants'>
      {variants.map((variant) => {
        const param = filterToSearchParam<'variants', 'some'>(
          getColorFilter(variant),
        )
        return (
          <li key={variant.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {getColorName(variant)}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
