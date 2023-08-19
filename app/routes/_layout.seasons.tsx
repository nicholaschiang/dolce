import { Link, useLoaderData } from '@remix-run/react'
import { nanoid } from 'nanoid/non-secure'

import { ListLayout } from 'components/list-layout'

import { prisma } from 'db.server'
import { FILTER_PARAM, filterToSearchParam } from 'filters'
import { log } from 'log.server'

export async function loader() {
  log.debug('getting seasons...')
  const seasons = await prisma.season.findMany({
    take: 100,
    orderBy: { year: 'desc' },
  })
  log.debug('got %d seasons', seasons.length)
  return seasons
}

export default function SeasonsPage() {
  const seasons = useLoaderData<typeof loader>()
  return (
    <ListLayout title='seasons'>
      {seasons.map((season) => {
        const param = filterToSearchParam<'season', 'is'>({
          id: nanoid(5),
          name: 'season',
          condition: 'is',
          value: { id: season.id, name: season.name, year: season.year },
        })
        return (
          <li key={season.id}>
            <Link
              prefetch='intent'
              className='link underline'
              to={`/products?${FILTER_PARAM}=${encodeURIComponent(param)}`}
            >
              {season.name} {season.year}
            </Link>
          </li>
        )
      })}
    </ListLayout>
  )
}
